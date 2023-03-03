import { Controller, Get, Render } from '@nestjs/common';

@Controller('workshops')
export class WorkshopsController {}

@Controller()
export class WorkshopsControllerRender {
  @Get()
  @Render('main/main')
  getMain() {
    return { data: '헬로 월드~' };
  }
}
