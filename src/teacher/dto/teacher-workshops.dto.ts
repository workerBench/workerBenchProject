import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateWorkshopsDto {
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
  readonly location: string;

  @IsNumber()
  readonly genre_id: number;

  @IsArray()
  readonly purpose_tag_id: Array<number | null>;
}
