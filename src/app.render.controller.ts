import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppRenderController {
  // 메인 페이지 render
  @Get()
  @Render('main/main')
  getMain() {
    return;
  }
}
