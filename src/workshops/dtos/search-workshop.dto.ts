import { PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { WorkShop } from 'src/entities/workshop';

export class SearchWorkshopDto {
  category?: string;
  location?: string;
  genre?: string;
  purpose?: string;
}
