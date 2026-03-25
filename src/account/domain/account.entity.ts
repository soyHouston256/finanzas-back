import { Transform } from 'class-transformer';

export class Account {
  @Transform(({ value }: { value: { toString(): string } }) => value.toString())
  _id: string;

  name: string;

  type: 'bank' | 'credit_card' | 'cash';

  currency: 'PEN' | 'USD';

  balance: number;

  credit_limit: number | null;
}
