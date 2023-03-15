import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsNumber()
  readonly company_type: number;

  @IsString()
  readonly company_name: string;

  @IsOptional()
  @IsNumber()
  readonly business_number: number;

  @IsOptional()
  @IsNumber()
  readonly rrn_front: number;

  @IsOptional()
  @IsNumber()
  readonly rrn_back: number;

  @IsString()
  readonly bank_name: string;

  @IsNumber()
  readonly account: number;

  @IsString()
  readonly saving_name: string;
}
