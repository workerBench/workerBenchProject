import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { MypageService } from 'src/mypage/mypage.service';
import { ReviewDto } from 'src/mypage/dtos/review.dto';
import { ReviewImageDto } from 'src/mypage/dtos/review-image.dto';
import { JwtUserAuthGuard } from 'src/auth/jwt/access/user/jwt-user-guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
import { PaymentDto } from 'src/mypage/dtos/payment.dto';

@ApiTags('mypage')
@UseInterceptors(SuccessInterceptor)
@Controller('/api/mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  // 수강 예정 워크샵 api
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '수강 예정 워크샵 api' })
  @Get('workshops/soon')
  @UseGuards(JwtUserAuthGuard)
  async getSoonWorkshops(@CurrentUser() user: CurrentUserDto) {
    return await this.mypageService.getSoonWorkshops(user.id);
  }

  // 수강 완료한 워크샵 api
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '수강 완료한 워크샵 api' })
  @Get('workshops/complete')
  @UseGuards(JwtUserAuthGuard)
  getCompleteWorkshops(@CurrentUser() user: CurrentUserDto) {
    return this.mypageService.getCompleteWorkshops(user.id);
  }

  // 워크샵 결제하기 api
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '워크샵 결제하기 api' })
  @Post('workshops/order')
  @UseGuards(JwtUserAuthGuard)
  async updateWorkshopPayment(
    @Body() paymentDto: PaymentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const check_result = await this.mypageService.checkPayment(
      user.id,
      paymentDto,
    );

    if (check_result === false) {
      return { message: '결제 내역이 정상적으로 기록되지 않았습니다.' };
    }
    return { message: '결제 내역이 정상적으로 기록되지 않았습니다.' };
  }

  // 리뷰 작성 페이지 api
  @ApiResponse({
    status: 201,
    description: '성공',
  })
  @ApiOperation({ summary: '리뷰 작성 페이지 api' })
  @Post('/:workshop_id/review')
  @UseGuards(JwtUserAuthGuard)
  review(
    @Param('workshop_id') workshop_id: number,
    @Body() review: ReviewDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.mypageService.review(workshop_id, user.id, review);
  }

  // 찜 목록 페이지에 찜한 워크샵 불러오기 api
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '찜 목록 페이지에 찜한 워크샵 불러오기 api' })
  @Get('/workshops/wish-list')
  @UseGuards(JwtUserAuthGuard)
  getWishList(
    @Param('workshop_id') workshop_id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.mypageService.getWishList(user.id);
  }

  // 찜 목록의 워크샵 찜 취소
  @ApiResponse({
    status: 201,
    description: '성공',
  })
  @ApiOperation({ summary: '워크샵 찜하기 취소 api' })
  @Patch('/workshops/wish-list/:id')
  @UseGuards(JwtUserAuthGuard)
  updateWishListCancel(
    @Param('workshop_id') workshop_id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.mypageService.updateWishListCancel(user.id, workshop_id);
  }
}
