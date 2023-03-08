import { IsString,IsNumber } from 'class-validator';

export class createCompanyDto {
  @IsNumber()
  readonly company_type: number;

  @IsString()
  readonly company_name: string;

  @IsNumber()
  readonly business_number: number;

  @IsNumber()
  readonly rrn_front: number;

  @IsNumber()
  readonly rrn_back: number;

  @IsString()
  readonly bank_name: string;

  @IsNumber()
  readonly account: number;

  @IsString()
  readonly saving_name: string;

  @IsNumber()
  readonly isBan: number;
}