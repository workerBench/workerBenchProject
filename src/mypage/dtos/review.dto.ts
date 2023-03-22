import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Review } from 'src/entities/review';

export class ReviewDto extends PickType(Review, ['content', 'star'] as const) {
  @IsNotEmpty()
  workshop_instance_detail: number;
}
