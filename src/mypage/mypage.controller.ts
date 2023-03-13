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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { MypageService } from 'src/mypage/mypage.service';
import { ReviewDto } from 'src/mypage/dtos/review.dto';
import { ReviewImageDto } from 'src/mypage/dtos/review-image.dto';


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
    async getSoonWorkshops() {
      return await this.mypageService.getSoonWorkshops();
    }

    // 수강 완료한 워크샵 api
    @ApiResponse({
      status: 200,
      description: '성공',
    })
    @ApiOperation({ summary: '수강 완료한 워크샵 api' })
    @Get('workshops/complete')
    getCompleteWorkshops() {
      return this.mypageService.getCompleteWorkshops();
    }


    // 워크샵 결제하기
    @Patch('workshops/:id/order')
    updateWorkshopPayment(@Param('id') id: number) {
      return this.mypageService.updateWorkshopPayment(id);
    }


    // 리뷰 작성 페이지

    @Post('/:workshop_id/review')
    review(
    @Param('workshop_id') workshop_id: number,
    @Body() review: Review,
  ) {
    const user_id = 1;
    return this.mypageService.review(
      workshop_id,
      user_id,
      review,
    );
  }


  // 찜 목록 페이지에 찜한 워크샵 불러오기

  @Get('/workshops/wish-list')
  getWishList(@Param('workshop_id') workshop_id: number) {
    return this.mypageService.getWishList(workshop_id);
  }


  // 찜 목록의 워크샵 찜 취소

  @Patch('/workshops/wish-list/:id')
  updateWishListCancel(@Param('workshop_id') user_id: number, workshop_id: number) {
    return this.mypageService.updateWishListCancel( user_id, workshop_id );
  }
    
}
