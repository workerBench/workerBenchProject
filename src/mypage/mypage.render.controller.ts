import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
import { JwtUserPageGuard } from 'src/auth/jwt/refresh-page-check/user/jwt-user-page-guard';
import { TOKEN_NAME } from 'src/auth/naming/token-name';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@ApiTags('z-page-render')
@Controller('mypage')
export class MypageControllerRender {
  constructor(private readonly authService: AuthService) {}

  // 마이 페이지 첫 접속 시 과거 내가 신청했던 워크샵 수강 현황 / 결과를 보여줌
  @Get('workshops')
  @UseGuards(JwtUserPageGuard)
  async getMyPageWorkshopList(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-login', { user: false });
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
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // 마이 페이지 - 후기 작성 페이지
  @Get('workshops/review')
  @UseGuards(JwtUserPageGuard)
  async getWritingReviewPage(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-login', { user: false });
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
        return res.render('mypage/reviews', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // 내 찜목록 리스트 페이지
  @Get('workshops/wishlist')
  @UseGuards(JwtUserPageGuard)
  async getMyWishListPage(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-login', { user: false });
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
        return res.render('mypage/wish-list', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }
}
