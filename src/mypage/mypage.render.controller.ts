import { Controller, Get, Render } from '@nestjs/common';

@Controller('mypage')
export class MypageControllerRender {
  // 마이페이지 나의 워크샵 목록 페이지 render
  @Get('/workshops')
  @Render('mypage/workshops')
  getMypageWorkshops() {
    return;
  }
}
