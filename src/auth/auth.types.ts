export type SecurityConfig = {
  pinHash: string;
  pinLength: number;
  createdAt: string;
  source: 'env' | 'file';
};

export type LoginAttemptState = {
  count: number;
  lockedUntil: number;
};

export type AccessTokenPayload = {
  sub: string;
  iat: number;
  exp: number;
  ip: string;
};
