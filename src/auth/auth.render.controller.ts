import { Controller,Get,Render } from '@nestjs/common';
@Controller()
export class AuthControllerRender {
  @Get('/auth/login')
  @Render('auth/login')
  q() {
  }
  @Get('/auth/password/change')
  @Render('auth/password-change')
  b() {
  }
  @Get('/auth/password/reset')
  @Render('auth/password-reset')
  c() {
  }
  @Get('/auth/signup')
  @Render('auth/signup')
  d() {
  }
}
