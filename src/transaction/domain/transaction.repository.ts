import { Transaction } from './transaction.entity';

export interface ITransactionRepository {
  findAll(): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
  create(transaction: Partial<Transaction>): Promise<Transaction>;
  update(
    id: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction | null>;
  delete(id: string): Promise<boolean>;
}
