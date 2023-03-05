import { Controller,Get,Render } from '@nestjs/common';
@Controller('auth')
export class AuthControllerRender {
  @Get('/login')
  @Render('auth/login')
  q() {
  }
  @Get('/password/change')
  @Render('auth/password-change')
  b() {
  }
  @Get('/password/reset')
  @Render('auth/password-reset')
  c() {
  }
  @Get('/signup')
  @Render('auth/signup')
  d() {
  }
}
