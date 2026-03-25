import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateTransactionDto {
  @IsDateString()
  date: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  category_slug: string;

  @IsString()
  @IsNotEmpty()
  subcategory_slug: string;

  @IsString()
  @IsNotEmpty()
  account_id: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
