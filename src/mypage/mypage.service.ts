import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/review';
import { ReviewImage } from 'src/entities/review-image';
import { WishList } from 'src/entities/wish-list';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';
import { ReviewDto } from 'src/mypage/dtos/review.dto';
import { ReviewImageDto } from 'src/mypage/dtos/review-image.dto';
import { Repository } from 'typeorm';
import { WorkShop } from 'src/entities/workshop';

@Injectable()
export class MypageService {
  constructor(
    @InjectRepository(WorkShop)
    private readonly workshopRepository: Repository<WorkShop>,
    @InjectRepository(WishList)
    private readonly wishListRepository: Repository<WishList>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewImage)
    private readonly reviewImageRepository: Repository<ReviewImage>,
    @InjectRepository(WorkShopInstanceDetail)
    private readonly workShopInstanceDetailRepository: Repository<WorkShopInstanceDetail>,
  ) {}

  // 수강 예정 워크샵 출력
  async getSoonWorkshops(id: number) {
    return await this.workShopInstanceDetailRepository.find({
      where: [
        { status: 'request', user_id: id },
        { status: 'non_payment', user_id: id },
        { status: 'waiting_lecture', user_id: id },
      ],
      order: { updatedAt: 'DESC' },
      take: 999,
    });
  }

  // 수강 완료한 워크샵 출력
  async getCompleteWorkshops(id: number) {
    return await this.workShopInstanceDetailRepository.find({
      where: { status: 'complete', user_id: id },
      order: { updatedAt: 'DESC' },
      take: 999,
    });
  }

  // 워크샵 결제하기
  async updateWorkshopPayment(id: number) {
    try {
      const status = await this.workShopInstanceDetailRepository.findOne({
        where: { id },
        select: ['status'],
      });

      if (!status) {
        throw new NotFoundException('수강 문의 기록이 존재하지 않습니다.');
      }

      if (status.status !== 'non_payment') {
        throw new BadRequestException('결제 가능한 상태가 아닙니다.');
      }

      await this.workShopInstanceDetailRepository.update(id, {
        status: 'waiting_lecture',
      });

      return { message: '결제가 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }

  // 찜 목록 불러오기

  async getWishList(userId: number) {
    try {
      const userWishList = await this.wishListRepository.find({
        where: { user_id: userId },
        select: ['workshop_id', 'createdAt'],
      });
      if (!userWishList) {
        throw new NotFoundException('등록하신 찜 목록이 없습니다');
      }

      const workshopIdArray = userWishList.map((wishList) => {
        return wishList.workshop_id;
      });

      const myWishWorkshops = await this.workshopRepository
        .createQueryBuilder('workshop')
        .where('workshop.id IN (:...wishWorkshops)', {
          wishWorkshops: workshopIdArray,
        })
        .innerJoinAndSelect('workshop.GenreTag', 'genreTag')
        .innerJoinAndSelect('workshop.PurposeList', 'workshopPurpose')
        .innerJoinAndSelect('workshopPurpose.PurPoseTag', 'purposeTag')
        .select([
          'workshop.id',
          'workshop.thumb',
          'workshop.title',
          'workshop.createdAt',
          'workshop.status',
          'workshop.price',
          'genreTag.name',
          'purposeTag.name',
        ])
        .getRawMany();

      return myWishWorkshops;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }

  // 워크샵 찜 or 취소하기 API
  /* wishList 엔티티에서 workshop_id와 user_id 찾은 후
      만약 값이 있으면 찜 해제
      없으면 user_id와 workshop_id insert */
  async updateWishListCancel(user_id: number, workshop_id: number) {
    const IsWish = await this.wishListRepository.findOne({
      where: { user_id, workshop_id },
    });
    if (!IsWish) {
      throw new BadRequestException('찜 등록이 된 워크샵이 아닙니다.');
    }
    await this.wishListRepository.delete({ user_id, workshop_id }); // 찜 해제
    return;
  }

  // 리뷰작성 API
  review(workshop_id: number, user_id: number, reviewDto: ReviewDto) {
    const { content, star } = reviewDto;
    this.reviewRepository.insert({
      user_id,
      workshop_id,
      content,
      star,
    });
    return '리뷰 등록이 완료되었습니다.';
  }

  // 리뷰 이미지 첨부 API
  reviewImage(reviewImageDto: ReviewImageDto) {
    const { img_name } = reviewImageDto;
    this.reviewImageRepository.insert({
      img_name,
    });
    return '리뷰 사진 등록이 완료되었습니다.';
  }
}
