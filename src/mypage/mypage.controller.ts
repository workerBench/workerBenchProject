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
  UploadedFile,
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
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';
import { RefundDto } from 'src/mypage/dtos/refund.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('mypage')
@UseInterceptors(SuccessInterceptor)
@Controller('/api/mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  // 수강 예정 워크샵 전체 조회 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '수강 예정 워크샵 전체 조회 api' })
  @Get('workshops/soon')
  @UseGuards(JwtUserAuthGuard)
  async getSoonWorkshops(@CurrentUser() user: CurrentUserDto) {
    return await this.mypageService.getSoonWorkshops(user.id);
  }

  // 수강 예정 워크샵 상세 조회 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '수강 예정 워크샵 상세 조회 api' })
  @Get('workshops/soon/:workshopDetailInstance_id') // workshopDetail
  @UseGuards(JwtUserAuthGuard)
  async getSoonWorkshopsById(
    @Param('workshopDetailInstance_id') workshopDetailInstance_id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return await this.mypageService.getSoonWorkshopsById(
      workshopDetailInstance_id,
      user.id,
    );
  }

  // 수강 완료 워크샵 전체 조회 API
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

  // 수강 완료 워크샵 상세 조회 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '수강 예정 워크샵 상세 조회 api' })
  @Get('workshops/complete/:workshopDetailInstance_id') // workshopDetail
  @UseGuards(JwtUserAuthGuard)
  async getCompleteWorkshopsById(
    @Param('workshopDetailInstance_id') workshopDetailInstance_id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return await this.mypageService.getCompleteWorkshopsById(
      workshopDetailInstance_id,
      user.id,
    );
  }

  // 워크샵 결제하기 클릭 시 status 유효성 검사
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '워크샵 결제 정보 입력창 열기 api' })
  @Post('workshops/orderInfo')
  @UseGuards(JwtUserAuthGuard)
  async putWorkshopOrderInfo(
    @Body() body: { workshopDetailId: number },
    @CurrentUser() user: CurrentUserDto,
  ) {
    const result = await this.mypageService.checkStatusIfNonPayment(
      user.id,
      body.workshopDetailId,
    );
    return result;
  }

  // 워크샵 결제 정보 입력 창에서 결제하기 클릭 시 아임포트 호출 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '워크샵 결제하기 api' })
  @Patch('workshops/order')
  @UseGuards(JwtUserAuthGuard)
  async updateWorkshopPayment(
    @Body() paymentInfo: PaymentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const check_result = await this.mypageService.checkPayment(
      user.id,
      paymentInfo,
    );

    if (check_result === false) {
      return { message: '결제 내역이 정상적으로 기록되지 않았습니다.' };
    }
    return { message: '결제 내역이 정상적으로 기록되었습니다.' };
  }

  // 환불 가능한 상태인지 status 유효성 검사
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '워크샵 환불 정보 입력창 열기 api' })
  @Post('workshops/refundInfo')
  @UseGuards(JwtUserAuthGuard)
  async putWorkshopRefundInfo(
    @Body() body: { workshopDetailId: number },
    @CurrentUser() user: CurrentUserDto,
  ) {
    const result = await this.mypageService.checkStatusIfWaitingLecture(
      user.id,
      body.workshopDetailId,
    );
    return result;
  }

  // 아임포트로 환불 요청하기 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '환불 요청하기 api' })
  @Post('workshops/order/refund')
  @UseGuards(JwtUserAuthGuard)
  async refundWorkshopPayment(
    @Body() refundInfo: RefundDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    console.log('-----', refundInfo);
    const check_result = await this.mypageService.refundWorkshopPayment(
      user.id,
      refundInfo,
    );
    if (check_result === true) {
      return { message: '환불 내역이 정상적으로 기록되었습니다.' };
    }
    return { message: '환불 내역이 정상적으로 기록되지 않았습니다.' };
  }

  // 수강 취소 워크샵 전체 조회 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '수강 취소한 워크샵 api' })
  @Get('workshops/refund')
  @UseGuards(JwtUserAuthGuard)
  getRefundWorkshops(@CurrentUser() user: CurrentUserDto) {
    return this.mypageService.getRefundWorkshops(user.id);
  }

  // 수강 취소 워크샵 상세 조회 API
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '수강 취소 워크샵 상세 조회 api' })
  @Get('workshops/refund/:workshopDetailInstance_id') // workshopDetail
  @UseGuards(JwtUserAuthGuard)
  async getRefundWorkshopsById(
    @Param('workshopDetailInstance_id') workshopDetailInstance_id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return await this.mypageService.getRefundWorkshopsById(
      workshopDetailInstance_id,
      user.id,
    );
  }

  // 리뷰 작성 post - 글내용 api
  @ApiResponse({
    status: 201,
    description: '성공',
  })
  @ApiOperation({ summary: '리뷰 작성 페이지 api' })
  @Post('workshops/review')
  @UseGuards(JwtUserAuthGuard)
  async review(
    @Body() reviewData: ReviewDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const reviewId = await this.mypageService.writingReview(
      reviewData.content,
      Number(reviewData.star),
      Number(reviewData.workshop_id),
      Number(reviewData.workshop_instance_detail_id),
      user.id,
    );
    return reviewId;
  }

  // 리뷰 작성 post - 이미지 api
  @ApiResponse({
    status: 201,
    description: '성공',
  })
  @ApiOperation({ summary: '리뷰 작성 페이지 - 이미지 등록 api' })
  @Post('workshops/review/image')
  @UseGuards(JwtUserAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  async reviewImage(
    @UploadedFile() image: Express.Multer.File,
    @Body() data: any,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return await this.mypageService.reviewImage(
      Number(data.reviewId),
      user.id,
      image,
    );
  }

  // 찜 목록 페이지에 찜한 워크샵 불러오기 api
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '찜 목록 페이지에 찜한 워크샵 불러오기 api' })
  @Get('workshops/wishlist')
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
  @Patch('workshops/wish-list/:id')
  @UseGuards(JwtUserAuthGuard)
  updateWishListCancel(
    @Param('workshop_id') workshop_id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.mypageService.updateWishListCancel(user.id, workshop_id);
  }
}
