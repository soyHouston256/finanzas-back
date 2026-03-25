import { IsIn, IsString, Length, Matches } from 'class-validator';

export class BootstrapDto {
  @IsString()
  @Matches(/^\d+$/)
  @Length(4, 6)
  pin: string;

  @IsIn([4, 5, 6])
  pinLength: 4 | 5 | 6;
}
