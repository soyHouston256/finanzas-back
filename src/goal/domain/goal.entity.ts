import { Transform } from 'class-transformer';

export class Goal {
  @Transform(({ value }: { value: { toString(): string } }) => value.toString())
  _id: string;

  name: string;

  target: number;

  current: number;

  date: string;

  payment: number;

  installment: string;
}
