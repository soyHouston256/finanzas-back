import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  target: number;

  @IsNumber()
  current: number;

  @IsDateString()
  date: string;

  @IsNumber()
  payment: number;

  @IsString()
  @IsNotEmpty()
  installment: string;
}
