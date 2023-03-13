import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
import { JwtUserAuthGuard } from 'src/auth/jwt/access/user/jwt-user-guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
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
  async getWorkshopDetail(
    @CurrentUser() user: CurrentUserDto,
    @Param('workshop_id') workshop_id: number,
  ) {
    const user_id = user?.id;
    return await this.workshopsService.getWorkshopDetail(user_id, workshop_id);
  }

  // 워크샵 찜 or 취소하기 AP
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '워크샵 찜하기 api' })
  @Post('/:workshop_id/wish')
  @UseGuards(JwtUserAuthGuard)
  async addToWish(
    @CurrentUser() user: CurrentUserDto,
    @Param('workshop_id') workshop_id: number,
  ) {
    try {
      // *user_id가 없으면 에러 처리 필요 ('로그인 후 이용 가능한 서비스입니다')

      const user_id = user.id;

      if (!user_id) {
        throw new UnauthorizedException('로그인 후 이용 가능합니다!');
      }
      return await this.workshopsService.addToWish(user_id, workshop_id);
    } catch (err) {
      throw new HttpException(`${err.message}`, 401);
    }
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
