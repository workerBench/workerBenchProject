import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // 메인 페이지 render
  @Get()
  @Render('main/main')
  getMain() {
    return;
  }

  // add a getHello method
  @Get('/hello')
  getHello() {
    return 'Hello World!';
  }
}
