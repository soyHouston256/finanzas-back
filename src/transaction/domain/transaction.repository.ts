import { Transaction } from './transaction.entity';
import { TransactionPage, TransactionPeriod } from './transaction-page';

export interface ITransactionRepository {
  findAll(params?: {
    page?: number;
    limit?: number;
    month?: number;
    year?: number;
  }): Promise<TransactionPage>;
  findAvailablePeriods(): Promise<TransactionPeriod[]>;
  findById(id: string): Promise<Transaction | null>;
  create(transaction: Partial<Transaction>): Promise<Transaction>;
  update(
    id: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction | null>;
  delete(id: string): Promise<boolean>;
}
