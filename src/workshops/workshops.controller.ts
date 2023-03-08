import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Order } from 'src/entities/order';
import { OrderWorkshopDto } from 'src/workshops/dtos/order-workshop.dto';
import { WorkshopsService } from 'src/workshops/workshops.service';

@Controller('/api/workshops')
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  // 인기 워크샵 조회 API
  @Get('/best')
  async getBestWorkshops() {
    return await this.workshopsService.getBestWorkshops();
  }

  // 신규 워크샵 조회 API
  @Get('/new')
  getNewWorkshops() {
    return this.workshopsService.getNewWorkshops();
  }

  // 승인된 워크샵 전체 조회 API
  @Get('/approval')
  async getApprovedWorkshops() {
    return await this.workshopsService.getApprovedWorkshops();
  }

  // 워크샵 검색 API
  // 워크샵 분야에 들어갈 키워드 정해야 함

  // 워크샵 상세 조회 API
  @Get('/:id')
  async getWorkshopDetail(@Param('id') id: number) {
    return await this.workshopsService.getWorkshopDetail(id);
  }

  // 워크샵 찜 or 취소하기 API
  @Post('/:workshop_id/wish')
  async addToWish(@Param('workshop_id') workshop_id: number) {
    const user_id = 2; // 하드코딩한 데이터 (user_id를 임의로 삽입함)
    return await this.workshopsService.addToWish(user_id, workshop_id);
  }

  // 특정 워크샵 후기 전체 조회 API
  @Get(':workshop_id/reviews')
  async getWorkshopReviews(@Param('workshop_id') workshop_id: number) {
    return await this.workshopsService.getWorkshopReviews(workshop_id);
  }

  // 워크샵 신청하기 API
  @Post(':workshop_id/order')
  orderWorkshop(
    @Param('workshop_id') workshop_id: number,
    @Body() orderWorkshopData: OrderWorkshopDto,
  ) {
    const user_id = 1;
    return this.workshopsService.orderWorkshop(
      workshop_id,
      user_id,
      orderWorkshopData,
    );
  }
}
