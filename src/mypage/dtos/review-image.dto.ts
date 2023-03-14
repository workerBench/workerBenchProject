import { PickType } from '@nestjs/swagger';
import { ReviewImage } from 'src/entities/review-image';

export class ReviewImageDto extends PickType(ReviewImage, [
  'img_name',
] as const) {}
