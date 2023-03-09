import { Controller, Get, Post, Param } from '@nestjs/common';
import { MypageService } from 'src/mypage/mypage.service';
import { ReviewDto } from 'src/mypage/dtos/review.dto';
import { ReviewImageDto } from 'src/mypage/dtos/review-image.dto';

@Controller('/api/mypage')
export class MypageController {      
    constructor(private readonly mypageService: MypageService) {}
    
    // 나의 워크샵 목록 불러오기

    @Get('workshops/:user_id')
    async GetWorkshops(@Param('user_id') user_id: number) {
      return this.mypageService.getWorkshops(id);
    }

    // 리뷰 작성 페이지

    @Post('/:workshop_id/review')
    review(
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
