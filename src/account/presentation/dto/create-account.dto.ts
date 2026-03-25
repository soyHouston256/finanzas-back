import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['bank', 'credit_card', 'cash'])
  type: 'bank' | 'credit_card' | 'cash';

  @IsIn(['PEN', 'USD'])
  currency: 'PEN' | 'USD';

  @IsNumber()
  balance: number;

  @IsOptional()
  @IsNumber()
  credit_limit: number | null;
}
