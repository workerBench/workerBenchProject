import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsSemVer } from 'class-validator';
import { Review } from 'src/entities/review';

export class ReviewDto extends PickType(Review, ['content', 'star'] as const) {
  @IsNotEmpty()
  workshop_id: number;

  @IsNotEmpty()
  workshop_instance_detail_id: number;
}
