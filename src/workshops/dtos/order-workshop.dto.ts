import { PickType } from '@nestjs/swagger';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';

export class OrderWorkshopDto extends PickType(WorkShopInstanceDetail, [
  'company',
  'name',
  'email',
  'phone_number',
  'member_cnt',
  'wish_date',
  'category',
  'purpose',
  'wish_location',
  'etc',
  'category',
] as const) {}
