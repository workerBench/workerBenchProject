import { IsString, IsNumber } from 'class-validator';

export class applicationDto {
  @IsNumber()
  readonly teacher_id: number;

  @IsNumber()
  readonly company_id: number;
}
