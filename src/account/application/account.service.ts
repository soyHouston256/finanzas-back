import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IAccountRepository } from '../domain/account.repository';
import { Account } from '../domain/account.entity';
import { CreateAccountDto } from '../presentation/dto/create-account.dto';
import { UpdateAccountDto } from '../presentation/dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: IAccountRepository,
  ) {}

  findAll(): Promise<Account[]> {
    return this.accountRepository.findAll();
  }

  async findById(id: string): Promise<Account> {
    const account = await this.accountRepository.findById(id);
    if (!account) throw new NotFoundException(`Account ${id} not found`);
    return account;
  }

  create(dto: CreateAccountDto): Promise<Account> {
    return this.accountRepository.create(dto);
  }

  async update(id: string, dto: UpdateAccountDto): Promise<Account> {
    const account = await this.accountRepository.update(id, dto);
    if (!account) throw new NotFoundException(`Account ${id} not found`);
    return account;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.accountRepository.delete(id);
    if (!deleted) throw new NotFoundException(`Account ${id} not found`);
  }
}
