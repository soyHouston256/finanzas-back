import { Transaction } from './transaction.entity';

export type TransactionPage = {
  items: Transaction[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type TransactionPeriod = {
  key: string;
  year: number;
  month: number;
};
