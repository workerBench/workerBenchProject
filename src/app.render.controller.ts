import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { AuthService } from './auth/auth.service';
import { CurrentUserDto } from './auth/dtos/current-user.dto';
import { JwtUserPageGuard } from './auth/jwt/refresh-page-check/user/jwt-user-page-guard';
import { TOKEN_NAME } from './auth/naming/token-name';
import { CurrentUser } from './common/decorators/user.decorator';

@Controller()
export class AppRenderController {
  constructor(private readonly authService: AuthService) {}

  // 메인 페이지 render
  @Get()
  @UseGuards(JwtUserPageGuard)
  async getMain(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('main/main', { user: false });
    }

    if (typeof user === 'object') {
      try {
        const refreshToken = req.cookies[TOKEN_NAME.userRefresh];
        // refresh 토큰 인증 검사
        await this.authService.checkRefreshTokenInRedis(
          user.id,
          user.user_type,
          clientIp,
          refreshToken,
        );
        return res.render('main/main', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('main/main', { user: false });
      }
    }
    return;
  }
}
