import { Controller, Get, Post, Body, Res, UseGuards, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { loginDTO } from './dtos/login.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { JwtRefreshAuthGuard } from './jwt/jwt.refreshGuard';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() body: loginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessJwt = await this.authService.verifyUserAndSignJwtAccess();
    const refreshJwt = await this.authService.verifyUserAndSignJwtRefresh();

    response.cookie('accessToken', accessJwt, { httpOnly: true });
    response.cookie('refreshToken', refreshJwt, { httpOnly: true });

    return { accessJwt, refreshJwt };
  }

  @Post('accesstoken')
  @UseGuards(JwtAuthGuard)
  async checkAccessToken(@CurrentUser() user) {
    return { success: true, user };
  }

  @Post('refreshtoken')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken() {
    return;
  }

  @Get()
  async getReFresh() {
    return this.authService.getRefreshTokenFromRedis();
  }
}
