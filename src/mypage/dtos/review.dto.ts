import { PickType } from '@nestjs/swagger';
import { Review } from 'src/entities/review';

export class ReviewDto extends PickType(Review, [
  'content',
  'star',
] as const) {}
