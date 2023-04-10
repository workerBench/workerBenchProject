import { PickType } from '@nestjs/swagger';
import { IsNumber, IsInt, IsPositive, IsNotEmpty } from 'class-validator';
import { WorkShop } from 'src/entities/workshop';

export class CreateWorkshopsVideoDto extends PickType(WorkShop, [
  'title',
] as const) {
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  workshop_id: number;
}
