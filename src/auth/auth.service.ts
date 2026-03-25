import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  AccessTokenPayload,
  LoginAttemptState,
  SecurityConfig,
} from './auth.types';

@Injectable()
export class AuthService {
  private readonly securityFilePath = resolve(
    process.cwd(),
    'storage',
    'security.json',
  );
  private readonly loginAttempts = new Map<string, LoginAttemptState>();

  constructor(private readonly configService: ConfigService) {}

  async getStatus() {
    const config = await this.getSecurityConfig();
    return {
      needsSetup: !config,
      pinLength: config?.pinLength ?? 4,
    };
  }

  async bootstrap(pin: string, pinLength: number, request: Request) {
    if (!this.isLocalRequest(request)) {
      throw new UnauthorizedException('Bootstrap allowed only from localhost');
    }

    const existing = await this.getSecurityConfig();
    if (existing) {
      throw new ConflictException('PIN already configured');
    }

    const payload: SecurityConfig = {
      pinHash: this.hashPin(pin),
      pinLength,
      createdAt: new Date().toISOString(),
      source: 'file',
    };

    await mkdir(resolve(process.cwd(), 'storage'), { recursive: true });
    await writeFile(
      this.securityFilePath,
      JSON.stringify(payload, null, 2),
      'utf8',
    );

    return this.issueAccessToken(request);
  }

  async login(pin: string, request: Request) {
    const requesterId = this.getRequesterId(request);
    const state = this.loginAttempts.get(requesterId);
    const now = Date.now();

    if (state?.lockedUntil && state.lockedUntil > now) {
      throw new HttpException(
        'Too many login attempts. Try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const config = await this.getSecurityConfig();
    if (!config) {
      throw new UnauthorizedException('PIN not configured');
    }

    if (!this.matchesHash(pin, config.pinHash)) {
      const nextCount = (state?.count ?? 0) + 1;
      const maxAttempts =
        this.configService.get<number>('AUTH_MAX_ATTEMPTS') ?? 5;
      const lockoutMs =
        this.configService.get<number>('AUTH_LOCKOUT_MS') ?? 60_000;
      this.loginAttempts.set(requesterId, {
        count: nextCount >= maxAttempts ? 0 : nextCount,
        lockedUntil: nextCount >= maxAttempts ? now + lockoutMs : 0,
      });
      throw new UnauthorizedException('Invalid PIN');
    }

    this.loginAttempts.delete(requesterId);
    return this.issueAccessToken(request);
  }

  validateAccessToken(token: string, request: Request): boolean {
    const secret = this.getTokenSecret();
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      return false;
    }

    const expectedSignature = this.sign(
      `${encodedHeader}.${encodedPayload}`,
      secret,
    );
    if (!this.safeCompare(signature, expectedSignature)) {
      return false;
    }

    try {
      const payload = JSON.parse(
        this.base64UrlDecode(encodedPayload),
      ) as AccessTokenPayload;
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp <= now) {
        return false;
      }
      return payload.ip === this.getRequesterId(request);
    } catch {
      return false;
    }
  }

  validateApiKey(rawApiKey?: string | string[]) {
    const apiKey = (Array.isArray(rawApiKey) ? rawApiKey[0] : rawApiKey)
      ?.split(',')[0]
      ?.trim();
    const expectedKey = this.configService.get<string>('API_KEY');
    return Boolean(apiKey && expectedKey && apiKey === expectedKey);
  }

  private async getSecurityConfig(): Promise<SecurityConfig | null> {
    const envHash = this.configService.get<string>('AUTH_PIN_HASH');
    if (envHash) {
      return {
        pinHash: envHash,
        pinLength: Number(
          this.configService.get<string>('AUTH_PIN_LENGTH') ?? 4,
        ),
        createdAt: 'env',
        source: 'env',
      };
    }

    if (!existsSync(this.securityFilePath)) {
      return null;
    }

    const raw = await readFile(this.securityFilePath, 'utf8');
    const parsed = JSON.parse(raw) as SecurityConfig;
    return parsed;
  }

  private issueAccessToken(request: Request) {
    const now = Math.floor(Date.now() / 1000);
    const ttl = this.configService.get<number>('AUTH_TOKEN_TTL_SECONDS') ?? 900;
    const payload: AccessTokenPayload = {
      sub: 'finanza-ui',
      iat: now,
      exp: now + ttl,
      ip: this.getRequesterId(request),
    };
    const encodedHeader = this.base64UrlEncode(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    );
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const signature = this.sign(
      `${encodedHeader}.${encodedPayload}`,
      this.getTokenSecret(),
    );

    return {
      accessToken: `${encodedHeader}.${encodedPayload}.${signature}`,
      expiresInSeconds: ttl,
    };
  }

  private hashPin(pin: string) {
    const salt =
      this.configService.get<string>('AUTH_PIN_SALT') ?? 'finanza-auth-salt';
    return createHash('sha256').update(`${salt}:${pin}`).digest('hex');
  }

  private matchesHash(pin: string, expectedHash: string) {
    return this.safeCompare(this.hashPin(pin), expectedHash);
  }

  private getTokenSecret() {
    return (
      this.configService.get<string>('AUTH_TOKEN_SECRET') ??
      this.configService.get<string>('API_KEY') ??
      'change-me-in-env'
    );
  }

  private sign(value: string, secret: string) {
    return createHmac('sha256', secret).update(value).digest('base64url');
  }

  private safeCompare(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    if (leftBuffer.length !== rightBuffer.length) {
      return false;
    }
    return timingSafeEqual(leftBuffer, rightBuffer);
  }

  private base64UrlEncode(value: string) {
    return Buffer.from(value).toString('base64url');
  }

  private base64UrlDecode(value: string) {
    return Buffer.from(value, 'base64url').toString('utf8');
  }

  private isLocalRequest(request: Request) {
    const requesterId = this.getRequesterId(request);
    return requesterId === '127.0.0.1' || requesterId === '::1';
  }

  private getRequesterId(request: Request) {
    const ip = request.ip || request.socket.remoteAddress || '';
    if (ip === '::ffff:127.0.0.1') return '127.0.0.1';
    return ip;
  }
}
