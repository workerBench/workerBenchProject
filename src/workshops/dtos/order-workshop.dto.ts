import { PickType } from '@nestjs/swagger';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';

export class OrderWorkshopDto extends PickType(WorkShopInstanceDetail, [
  'company',
  'name',
  'email',
  'phone_number',
  'wish_date',
  'purpose',
  'wish_location',
  'member_cnt',
  'etc',
  'category',
] as const) {}
