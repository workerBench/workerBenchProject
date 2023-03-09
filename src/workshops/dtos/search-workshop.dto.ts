import { PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { WorkShop } from 'src/entities/workshop';

export class SearchWorkshopDto {
  @IsString()
  category?: string;

  @IsNumber()
  member_cnt?: string;

  @IsString()
  location?: string;

  @IsString()
  genre_id?: string;

  @IsString()
  PurposeLise?: string;
}
