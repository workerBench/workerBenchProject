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


    // 워크샵 결제하기 api
    @ApiResponse({
      status: 200,
      description: '성공',
    })
    @ApiOperation({ summary: '워크샵 결제하기 api' })
    @Patch('workshops/:id/order')
    updateWorkshopPayment(@Param('id') id: number) {
      return this.mypageService.updateWorkshopPayment(id);
    }


    // 리뷰 작성 페이지 api
    @ApiResponse({
      status: 201,
      description: '성공',
    })
    @ApiOperation({ summary: '리뷰 작성 페이지 api' })
    @Post('/:workshop_id/review')
    review(
      @Param('workshop_id') workshop_id: number,
      @Body() review: ReviewDto,
      ) {
    const user_id = 1;    
    return this.mypageService.review(
      workshop_id,
      user_id,
      review,
    );
  }



  // 찜 목록 페이지에 찜한 워크샵 불러오기 api
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '찜 목록 페이지에 찜한 워크샵 불러오기 api' })
  @Get('/workshops/wish-list')
  getWishList(@Param('workshop_id') workshop_id: number) {
    const user_id = 2; // 하드코딩한 데이터 (user_id를 임의로 삽입함)
    return this.mypageService.getWishList();
  }


  // 찜 목록의 워크샵 찜 취소
  @ApiResponse({
    status: 201,
    description: '성공',
  })
  @ApiOperation({ summary: '워크샵 찜하기 취소 api' })
  @Patch('/workshops/wish-list/:id')
  updateWishListCancel(@Param('workshop_id') workshop_id: number) {
    const user_id = 2; // 하드코딩한 데이터 (user_id를 임의로 삽입함)
    return this.mypageService.updateWishListCancel( user_id, workshop_id );
  }
    
}
