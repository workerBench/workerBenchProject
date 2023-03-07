import { IsString,IsNumber } from 'class-validator';

export class createWorkshopsDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly category: string;

  @IsString()
  readonly desc: string;

  @IsString()
  readonly thumb: string;

  @IsNumber()
  readonly min_member: number;

  @IsNumber()
  readonly max_member: number;

  @IsNumber()
  readonly total_time: number;

  @IsNumber()
  readonly price: number;

  @IsString()
  readonly status: string;

  @IsString()
  readonly location: string;
}