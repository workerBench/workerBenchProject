import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order';
import { PurposeTag } from 'src/entities/purpose-tag';
import { Review } from 'src/entities/review';
import { WishList } from 'src/entities/wish-list';
import { WorkShop } from 'src/entities/workshop';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';
import { OrderWorkshopDto } from 'src/workshops/dtos/order-workshop.dto';
import { SearchWorkshopDto } from 'src/workshops/dtos/search-workshop.dto';
import { WorkshopRepository } from 'src/workshops/workshop.repository';
import {
  Brackets,
  DataSource,
  getConnection,
  getManager,
  Repository,
} from 'typeorm';

@Injectable()
export class WorkshopsService {
  constructor(
    private readonly workshopRepository: WorkshopRepository,
    @InjectRepository(WishList)
    private readonly wishRepository: Repository<WishList>,
    @InjectRepository(WorkShopInstanceDetail)
    private readonly workshopDetailRepository: Repository<WorkShopInstanceDetail>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  // 인기 워크샵 조회 API
  // 최근 가장 결제 횟수가 많은 순으로 워크샵을 8개까지 가져온다.
  async getBestWorkshops() {
    return await this.workshopRepository.getWorkshopsByOrder();
  }

  // 신규 워크샵 조회 API
  // 전체 워크샵 중에서 createdAt이 가장 최근인 순(=내림차순)으로 정렬한 후 최대 8개를 가져온다.
  async getNewWorkshops() {
    return await this.workshopRepository.find({
      order: { createdAt: 'DESC' },
      take: 8,
    });
  }

  // 워크샵 검색 API (옵션을 선택할 때마다 검색 결과가 조회되어야 함)

  async searchWorkshops(
    category: string,
    location: string,
    genre: string,
    purpose: string,
  ) {
    const queryBuilder = this.workshopRepository
      .createQueryBuilder('workshop')
      .innerJoinAndSelect('workshop.GenreTag', 'genre_tag') // workshop - GenreTag 테이블 조인
      .innerJoinAndSelect('workshop.PurposeList', 'purpose') // 조인한 결과에 PuposeList 테이블 조인
      .innerJoinAndSelect('purpose.PurPoseTag', 'purposeTag') // 조인한 결과에 PurPoseTag 테이블 조인
      .select([
        'workshop.id',
        'workshop.title',
        'workshop.category',
        'workshop.location',
        'workshop.price',
        'workshop.min_member',
        'workshop.max_member',
        'genre_tag.name',
        'purposeTag.name',
        'GROUP_CONCAT(purposeTag.name) AS purposeTag_name',
      ])
      .groupBy('workshop.id');

    // 각 태그(ex. category)가 query parameter로 들어온다면 andWhere로 찾기
    if (category) {
      queryBuilder.andWhere('workshop.category = :category', {
        category: `${category}`,
      });
    }

    if (location) {
      queryBuilder.andWhere('workshop.location = :location', {
        location: `${location}`,
      });
    }

    if (genre) {
      queryBuilder.andWhere('genre_tag.name = :genre', {
        genre: `${genre}`,
      });
    }

    if (purpose) {
      queryBuilder.andWhere('purposeTag.name = :purpose', {
        purpose: `${purpose}`,
      });
    }

    const workshops = await queryBuilder.getRawMany();

    // purposeTag_name 결과를 콤마(,) 기준으로 쪼개서 배열에 담아줌
    return workshops.map((workshop) => ({
      ...workshop,
      purposeTag_name: workshop.purposeTag_name.split(','),
    }));
  }

  // 승인된 전체 워크샵 조회 API
  // status가 approval인 워크샵을 updatedAt이 최신 순으로 불러온다.
  // *페이지네이션 추가 필요*
  async getApprovedWorkshops() {
    return await this.workshopRepository.find({
      where: { status: 'approval' },
      order: { updatedAt: 'DESC' },
    });
  }

  // 워크샵 상세 조회 API
  // id에 해당하는 워크샵 정보만 가져온다.
  async getWorkshopDetail(id: number) {
    return await this.workshopRepository.findOne({ where: { id } });
  }

  // 워크샵 찜 or 취소하기 API
  /* wishList 엔티티에서 workshop_id와 user_id 찾은 후
  만약 값이 있으면 찜 해제
  없으면 user_id와 workshop_id insert */
  async addToWish(user_id: number, workshop_id: number) {
    const IsWish = await this.wishRepository.findOne({
      where: { user_id, workshop_id },
    });
    if (IsWish === null) {
      await this.wishRepository.insert({ user_id, workshop_id });
      return '찜하기 성공!';
    }
    await this.wishRepository.delete({ user_id, workshop_id }); // 찜 해제
    return '찜하기 취소!';
  }

  // 워크샵 후기 불러오기 API
  async getWorkshopReviews(workshop_id: number) {
    return await this.reviewRepository.find({
      where: { workshop_id, deletedAt: null },
    });
  }

  // 워크샵 신청하기 API
  orderWorkshop(
    workshop_id: number,
    user_id: number,
    orderWorkshopDto: OrderWorkshopDto,
  ) {
    const {
      company,
      name,
      email,
      phone_number,
      wish_date,
      purpose,
      wish_location,
      member_cnt,
      etc,
      category,
    } = orderWorkshopDto;
    this.workshopDetailRepository.insert({
      company,
      name,
      email,
      phone_number,
      wish_date,
      purpose,
      wish_location,
      member_cnt,
      etc,
      category,
      user_id,
      workshop_id,
    });
    return '워크샵 문의 신청이 완료되었습니다.';
  }
}
