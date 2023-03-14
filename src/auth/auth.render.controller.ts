import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Response, Request } from 'express';
import { CurrentUserDto } from './dtos/current-user.dto';
import { JwtUserPageGuard } from './jwt/refresh-page-check/user/jwt-user-page-guard';
import { TOKEN_NAME } from './naming/token-name';
import { RealIP } from 'nestjs-real-ip';
import { AuthService } from './auth.service';

@Controller()
export class AuthControllerRender {
  constructor(private readonly authService: AuthService) {}

  // 로그인 페이지
  @Get('/auth/login')
  @UseGuards(JwtUserPageGuard)
  async getLoginPage(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    // 로그인이 되어 있지 않을 경우. 로그인 화면을 그냥 보여준다.
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/login', { user_id: 1 });
    }

    // 로그인이 되어 있는 경우. 이미 로그인이 되어 있으니 메인 화면으로 가라는 페이지를 보여준다.
    // 해당 페이지가 정말로 중요한 페이지다? ip와 redis 까지 명백히 검사. 아니면 그냥 render 를 바로 리턴.
    if (typeof user === 'object') {
      try {
        // 사용자의 refresh token 을 가져온다
        const refreshToken = req.cookies[TOKEN_NAME.userRefresh];
        // refresh 토큰 인증 검사
        await this.authService.checkRefreshTokenInRedis(
          user.id,
          user.user_type,
          clientIp,
          refreshToken,
        );
        // 해당 유저가 확실하게 로그인된 상태임을 알았으니, 이미 로그인이 되어 있다는 화면을 전달.
        return res.render('auth/login-user-go-to-main');
      } catch (err) {
        // 로그인은 되어 있으나, refresh 토큰에 뭔가 문제가 있거나 redis 에서 로그인 기록을 찾지를 못하고 있다.
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-authority');
      }
    }
  }

  // 회원가입 페이지
  @Get('/auth/signup')
  @UseGuards(JwtUserPageGuard)
  async getRegisterPage(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Res() res: Response,
  ) {
    // 토큰 인증을 통과하지 못했다 = 즉 로그인 상태가 아니니 회원가입 페이지를 보여준다.
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/signup');
    }
    // 토큰 인증을 통과했다 = 즉 로그인 상태이니 회원가입이 필요없다며 메인으로 가라는 페이지를 보여준다.
    return res.render('auth/login-user-go-to-main');
  }

  // 비밀번호 재설정 시도 시 이메일 인증 신청 페이지.
  @Get('/auth/password/reset')
  @UseGuards(JwtUserPageGuard)
  async getEmailAuthPageForPasswordReset(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Res() res: Response,
  ) {
    // 토큰 인증을 통과하지 못했다 = 로그인 상태가 아니니 페이지 열람 가능.
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/password-reset');
    }
    // 토큰 인증을 통과 했다 = 로그인 된 상태이니 로그아웃 후 진행하라 표시해준다.
    return res.render('auth/login-user-go-to-main');
  }

  // 비밀번호 재설정 시도 시 이메일 인증 통과 후 재설정 페이지.
  @Get('/auth/password/change')
  @UseGuards(JwtUserPageGuard)
  async getPasswordResetPage(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    // 토큰 검증을 통과했다 = 로그인 상태이니 로그아웃 후 다시 진행하라는 페이지를 보여줌.
    if (typeof user === 'object') {
      return res.render('auth/login-user-go-to-main');
    }

    // 토큰 검증을 통과하지 못했다 = 로그인 상태가 아니니 계속해서 진행
    if (typeof user === 'boolean' && user === false) {
      try {
        // 사용자의 refresh token 을 가져온다. 이메일이 담겨 있음.
        const email = req.cookies[TOKEN_NAME.emailForChangePs];
        // 이메일 인증을 통한 비밀번호 재설정 절차를 진행중인 유저인지 확인한다.
        await this.authService.checkResetPsOnTheWay(email, clientIp);
        // 해당 유저가 로그인 된 유저이며 적합한 절차로 비밀번호 재설정을 진행하고 있음. 따라서 재설정 페이지를 보여준다.
        return res.render('auth/password-change');
      } catch (err) {
        return res.render('auth/non-authority');
      }
    }
  }
}
