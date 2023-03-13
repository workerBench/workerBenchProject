import { Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { MypageService } from 'src/mypage/mypage.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ReviewDto } from 'src/mypage/dtos/review.dto';
import { ReviewImageDto } from 'src/mypage/dtos/review-image.dto';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';

    @Controller('/api/mypage')
    export class MypageController {      
    constructor(private readonly mypageService: MypageService) {}
    

    // 나의 워크샵 목록 불러오기
    @Get('workshops')
    async GetMyWorkshops(@CurrentUser() user: CurrentUserDto) {
    return await this.mypageService.GetMyWorkshops();
    
  }

      // 수강 예정 워크샵
    @Get('workshops/request')
    async getSoonWorkshops() {
      return await this.mypageService.getSoonWorkshops();
    }

    // 수강 완료한 워크샵
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
  async getWishList(@Param('workshop_id') user_id: number,workshop_id: number) {
    return this.mypageService.getWishList(user_id, workshop_id);
  }


  // 찜 목록의 워크샵 찜 취소

  @Patch('/workshops/wish-list/:id')
  updateWishListCancel(@Param('workshop_id') user_id: number, workshop_id: number) {
    return this.mypageService.updateWishListCancel( user_id, workshop_id );
  }
    
}
