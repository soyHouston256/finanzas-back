import { IsString, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^\d+$/)
  @Length(4, 6)
  pin: string;
}
