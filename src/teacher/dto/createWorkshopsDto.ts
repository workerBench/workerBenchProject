import { IsString, IsNumber } from 'class-validator';

export class createWorkshopsDto {
  @IsString()
  readonly category: 'online' | 'offline';

  @IsString()
  readonly title: string;

  @IsNumber()
  readonly genre_id: number;

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
  readonly workshop_id: number;
}
