import { PickType } from '@nestjs/swagger';
import { WorkShop } from 'src/entities/workshop';

export class SearchWorkshopDto extends PickType(WorkShop, [
  'category',
  'location',
  'genre_id',
  'PurposeList',
] as const) {}
