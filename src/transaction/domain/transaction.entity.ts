import { Transform } from 'class-transformer';

export class Transaction {
  @Transform(({ value }: { value: { toString(): string } }) => value.toString())
  _id: string;

  date: string;

  amount: number;

  category_slug: string;

  subcategory_slug: string;

  account_id: string;

  description: string;
}
