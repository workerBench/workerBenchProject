import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishList } from 'src/entities/wish-list';
import { WorkShop } from 'src/entities/workshop';
import { Repository } from 'typeorm';

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(WorkShop)
    private readonly workshopRepository: Repository<WorkShop>,
    @InjectRepository(WishList)
    private readonly wishRepository: Repository<WishList>,
  ) {}

  // 인기 워크샵 조회 API
  getBestWorkshops() {}

  // 신규 워크샵 조회 API
  // 전체 워크샵 중에서 createdAt이 가장 최근인 순(=내림차순)으로 정렬한 후 최대 8개를 가져온다.
  async getNewWorkshops() {
    return await this.workshopRepository.find({
      order: { createdAt: 'DESC' },
      take: 8,
    });
  }

  // 워크샵 상세 조회 API
  // id에 해당하는 워크샵 정보만 가져온다.
  async getWorkshopDetail(id: number) {
    return await this.workshopRepository.findOneBy({ id });
  }

  // 워크샵 찜 or 취소하기 API
  // wishList 엔티티에서 workshop_id와 user_id 찾은 후
  // 만약 값이 있으면 찜 해제
  // 없으면 user_id와 workshop_id insert
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
  async getWorkshopReviews(id: number) {
    return await this.workshopRepository.find();
  }
}
