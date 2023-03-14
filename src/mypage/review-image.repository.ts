import { Injectable } from '@nestjs/common';
import { ReviewImage } from 'src/entities/review-image';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReviewImageRepository extends Repository<ReviewImage> {
  constructor(private dataSource: DataSource) {
    super(ReviewImage, dataSource.createEntityManager());
  }

  async getReview() {
    const result = await this.dataSource.query(
      'img_name',
    );
    return result;
  }
}
