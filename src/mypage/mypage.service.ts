import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/review';
import { ReviewImage } from 'src/entities/review-image';
import { WishList } from 'src/entities/wish-list';
import { ReviewDto } from 'src/mypage/dtos/review.dto';
import { ReviewImageDto } from 'src/mypage/dtos/review-image.dto';
import { Repository } from 'typeorm';

@Injectable()
export class MypageService {
    constructor(
        @InjectRepository(WishList)
        private readonly wishRepository: Repository<WishList>,
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(ReviewImage)
        private readonly reviewImageRepository: Repository<ReviewImage>,
    ){}

    getWorkshops() {
        return this.mypage
    }


    // 강사 수락 대기중, 결제 대기중, 결제완료 워크샵 출력
    async getBeforeWorkshops() {
        return await this.workshopRepository.find({
          where: { status: 'request', 'approval'},
          order: { updatedAt: 'DESC' },
        });
      }

    // 수강 완료한 워크샵 출력
    async getFinishedWorkshops() {
        return await this.workshopRepository.find({
          where: { status: 'finished' },
          order: { updatedAt: 'DESC' },
        });
      }


    // 리뷰작성 API
  review(
    workshop_id: number,
    user_id: number,
    reviewDto: reviewDto,
  ) {
    const {
      content,
      star,
    } = reviewDto;
    this.reviewRepository.insert({
        content,
        star,
    });
    return '리뷰 등록이 완료되었습니다.';
  }

    // 리뷰 이미지 첨부 API
    reviewImage(
        reviewImageDto: reviewImageDto,
      ) {
        const {
          img_name,
        } = reviewImageDto;
        this.reviewImageRepository.insert({
            img_name,
        });
        return '리뷰 사진 등록이 완료되었습니다.';
      }



}
