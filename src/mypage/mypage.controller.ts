import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { MypageService } from 'src/mypage/mypage.service';
import { ReviewDto } from 'src/mypage/dtos/review.dto';
import { ReviewImageDto } from 'src/mypage/dtos/review-image.dto';

@Controller('/api/mypage')
export class MypageController {      
    constructor(private readonly mypageService: MypageService) {}
    
    // 나의 워크샵 목록 불러오기

    @Get('workshops')
    async GetMyWorkshops(@Param('user_id') user_id: number) {
      return await this.MypageService.getMyWorkshops();
    }

    // 리뷰 작성 페이지

    @Post('/:workshop_id/review')
    review(
    @Param('workshop_id') workshop_id: number,
    @Body() getCompleteWorkshops: GetCompleteWorkshops,
  ) {
    const user_id = 1;
    return this.MypageService.getCompleteWorkshops(
      workshop_id,
      user_id,
      getCompleteWorkshops,
    );
  }


  // 찜 목록 페이지에 찜한 워크샵 불러오기

  @Get('/workshops/wish-list')
  async GetWishList(@Param('workshop_id') workshop_id: number) {
    return this.mypageService.getWishList(workshop_id);
  }

  // 찜 목록의 워크샵 찜 취소

  @Delete('/workshops/wish-list/:id')
  async deleteToWish(@Param('workshop_id') workshop_id: number) {
    const user_id = 2; // 하드코딩한 데이터 (user_id를 임의로 삽입함)
    return await this.mypageService.deleteToWish(user_id, workshop_id);
  }
    
}
