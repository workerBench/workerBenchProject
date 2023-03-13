import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AuthControllerRender {
  @Get('/auth/login')
  @Render('auth/login')
  q() {
    return;
  }

  @Get('/auth/password/change')
  @Render('auth/password-change')
  b() {
    return;
  }

  @Get('/auth/password/reset')
  @Render('auth/password-reset')
  c() {
    return;
  }

  @Get('/auth/signup')
  @Render('auth/signup')
  d() {
    return;
  }
}
