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

  // 마이 페이지 첫 접속 시 과거 내가 신청했던 워크샵 수강 현황 / 결과를 보여줌
  @Get('workshop')
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
        return res.render('mypage/myPage', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // 마이 페이지 - 후기 작성 페이지
  @Get('workshop/review')
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
        return res.render('mypage/review', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // 내 찜목록 리스트 페이지
  @Get('wishlist')
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
        return res.render('mypage/myWishList', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }
}




// 상단의 코드는 민수님께서 변경하신 내역
// 하단의 경우 내가 조치한 내역





// import { Controller, Get, Render } from '@nestjs/common';


// @Controller('mypage')
// export class MypageControllerRender {

//   // 나의 워크샵 목록 불러오기
//   @Get('/workshops')
//   @Render('mypage/workshops')
//   getMyPageWorkshopsResult() {
//     return;
//   }
  
//   // 후기 작성하기
//   @Get('/workshops/reviews')
//   @Render('mypage/reviews')
//   getMyPageReviewsResult() {
//     return;
//   }

//   // 내가 찜한 워크샵 불러오기
//   @Get('/workshops/wish-list')
//   @Render('mypage/wish-list')
//   getMyPageWishListResult() {
//     return;
//   }

//   // 강사 등록
//   @Get('/teacher/register')
//   @Render('teacher/teacher-register')
//   getMyPageTeacherRegisterResult() {
//     return;
//   }


// }
