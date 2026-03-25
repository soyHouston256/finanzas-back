import {
  IsInt,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CategoryBudgetDto {
  @IsNumber()
  budgeted: number;

  @IsNumber()
  spent: number;

  @IsNumber()
  remaining: number;

  @IsNumber()
  pct_used: number;
}

export class CreateTrackingDto {
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  @Min(2000)
  year: number;

  @IsNumber()
  total_income: number;

  @IsNumber()
  total_expenses: number;

  @IsNumber()
  expected_income: number;

  @IsOptional()
  @IsObject()
  categories: Record<string, CategoryBudgetDto>;
}
