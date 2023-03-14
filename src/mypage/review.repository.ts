import { Injectable } from '@nestjs/common';
import { Review } from 'src/entities/review';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor(private dataSource: DataSource) {
    super(Review, dataSource.createEntityManager());
  }

  async getReview() {
    const result = await this.dataSource.query(
      'content, star',
    );
    return result;
  }
}
