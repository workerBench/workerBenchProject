import { PickType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { WorkShop } from 'src/entities/workshop';

export class CreateWorkshopsDto extends PickType(WorkShop, [
  'title',
  'category',
  'min_member',
  'max_member',
  'genre_id',
  'total_time',
  'desc',
  'price',
  'location',
] as const) {
  @IsArray()
  purpose_tag_id: Array<number | null>;
}
