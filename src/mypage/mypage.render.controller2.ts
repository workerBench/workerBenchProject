import { Controller, Get, Render } from '@nestjs/common';


@Controller('mypage')
export class MypageControllerRender {

  // 나의 워크샵 목록 불러오기
  @Get('/workshops')
  @Render('mypage/workshops')
  getMyPageWorkshopsResult() {
    return;
  }
  
  // 후기 작성하기
  @Get('/workshops/reviews')
  @Render('mypage/reviews')
  getMyPageReviewsResult() {
    return;
  }

  // 내가 찜한 워크샵 불러오기
  @Get('/workshops/wish-list')
  @Render('mypage/wish-list')
  getMyPageWishListResult() {
    return;
  }

  // 강사 등록
  @Get('/teacher/register')
  @Render('teacher/teacher-register')
  getMyPageTeacherRegisterResult() {
    return;
  }


}
