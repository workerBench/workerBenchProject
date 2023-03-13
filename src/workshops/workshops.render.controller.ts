import { Controller, Get, Render } from '@nestjs/common';

@Controller('workshops')
export class WorkshopsControllerRender {
  // 워크샵 검색 페이지 render
  @Get('/search')
  @Render('workshops/workshop-search')
  getWorkshopsSearchResult() {
    return;
  }

  // 워크샵 상세 페이지 render (신청 페이지 모달 포함)
  @Get('/detail')
  @Render('workshops/workshop-detail')
  getWorkshopsDetail() {
    return;
  }
}
