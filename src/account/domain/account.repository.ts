import { Account } from './account.entity';

export interface IAccountRepository {
  findAll(): Promise<Account[]>;
  findById(id: string): Promise<Account | null>;
  create(account: Partial<Account>): Promise<Account>;
  update(id: string, account: Partial<Account>): Promise<Account | null>;
  delete(id: string): Promise<boolean>;
}
