import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
import { JwtUserPageGuard } from 'src/auth/jwt/refresh-page-check/user/jwt-user-page-guard';
import { TOKEN_NAME } from 'src/auth/naming/token-name';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('mypage')
export class MypageControllerRender {
  constructor(private readonly authService: AuthService) {}
  // 마이페이지 나의 워크샵 목록 페이지 render
  @Get('/workshops')
  @UseGuards(JwtUserPageGuard)
  async getMypageWorkshops(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('/', { user: false });
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
        return res.render('mypage/workshops', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('/', { user: false });
      }
    }
    return;
  }

}
