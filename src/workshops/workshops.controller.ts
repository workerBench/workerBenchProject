import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { OrderWorkshopDto } from 'src/workshops/dtos/order-workshop.dto';
import { WorkshopsService } from 'src/workshops/workshops.service';

@ApiTags('workshops')
@UseInterceptors(SuccessInterceptor)
@Controller('/api/workshops')
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  // 인기 워크샵 조회 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '인기 워크샵 조회 api' })
  @Get('/best')
  async getBestWorkshops() {
    return await this.workshopsService.getBestWorkshops();
  }

  // 신규 워크샵 조회 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '신규 워크샵 조회 api' })
  @Get('/new')
  getNewWorkshops() {
    return this.workshopsService.getNewWorkshops();
  }

  // 승인된 워크샵 전체 조회 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '승인 완료된 워크샵 전체 조회 api' })
  @Get('/approval')
  async getApprovedWorkshops() {
    return await this.workshopsService.getApprovedWorkshops();
  }

  // 워크샵 검색 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '워크샵 검색 api' })
  @Get('/search')
  async searchWorkshops(
    @Query('category') category: string,
    @Query('location') location: string,
    @Query('genre') genre: string,
    @Query('purpose') purpose: string,
    @Query('memberCnt') memberCnt: number,
  ) {
    return await this.workshopsService.searchWorkshops(
      category,
      location,
      genre,
      purpose,
      memberCnt,
    );
  }

  // 워크샵 상세 조회 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '워크샵 상세 조회 api' })
  @Get('/:workshop_id')
  async getWorkshopDetail(@Param('workshop_id') workshop_id: number) {
    return await this.workshopsService.getWorkshopDetail(workshop_id);
  }

  // 워크샵 찜 or 취소하기 AP
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '워크샵 찜하기 api' })
  @Post('/:workshop_id/wish')
  async addToWish(@Param('workshop_id') workshop_id: number) {
    const user_id = 2; // 하드코딩한 데이터 (user_id를 임의로 삽입함)
    return await this.workshopsService.addToWish(user_id, workshop_id);
  }

  // 특정 워크샵 후기 전체 조회 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '특정 워크샵 후기 조회 api' })
  @Get(':workshop_id/reviews')
  async getWorkshopReviews(@Param('workshop_id') workshop_id: number) {
    return await this.workshopsService.getWorkshopReviews(workshop_id);
  }

  // 워크샵 신청하기 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '워크샵 신청 문의하기 api' })
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
