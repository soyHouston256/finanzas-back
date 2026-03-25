import { Transform } from 'class-transformer';

export class CategoryBudget {
  budgeted: number;
  spent: number;
  remaining: number;
  pct_used: number;
}

export class Tracking {
  @Transform(({ value }: { value: { toString(): string } }) => value.toString())
  _id: string;

  month: number;

  year: number;

  total_income: number;

  total_expenses: number;

  expected_income: number;

  categories: Record<string, CategoryBudget>;
}
