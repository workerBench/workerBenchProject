import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { AuthService } from 'src/auth/auth.service';
import { CurrentAdminDto } from 'src/auth/dtos/current-user.dto';
import { JwtNormalAdminPageGuard } from 'src/auth/jwt/refresh-page-check/admin/jwt-normal-admin-page-guard';
import { TOKEN_NAME } from 'src/auth/naming/token-name';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('admin')
export class AdminControllerRender {
  constructor(private readonly authService: AuthService) {}

  // ----------------- 관리자 로그인 페이지 랜더 ----------------- //
  @Get('/login')
  @UseGuards(JwtNormalAdminPageGuard)
  async admin_login(
    @CurrentUser() user: CurrentAdminDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    console.log('랜더링 함수 ---');
    console.log(user);
    if (typeof user === 'boolean' && user === false) {
      return res.render('admin/admin-login', { user: false });
    }

    if (typeof user === 'object') {
      try {
        const refreshToken = req.cookies[TOKEN_NAME.adminRefresh];
        // refresh 토큰 인증 검사
        await this.authService.checkAdminRefreshTokenInRedis(
          user.id,
          user.admin_type,
          clientIp,
          refreshToken,
        );
        return res.render('auth/already-admin-login', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // ----------------- 워크숍 관리 페이지 렌더 ----------------- //

  @Get('/workshops-request')
  @UseGuards(JwtNormalAdminPageGuard)
  @Render('admin/workshops-request')
  async request_workshops_data() {}

  @Get('/workshops-approval')
  @Render('admin/workshops-approval')
  approval_workshops_data() {}

  @Get('/workshops-finished')
  @Render('admin/workshops-finished')
  finished_workshops_data() {}

  // ----------------- 유저 및 업체 관리 페이지 렌더 ----------------- //

  @Get('/black-register')
  @Render('admin/black-register')
  black_register_data() {}

  @Get('/black-list')
  @Render('admin/black-list')
  black_list_data() {}

  // ----------------- 관리자 계정 관리 페이지 렌더 ----------------- //

  @Get('/admin-manage')
  @Render('admin/admin-manage')
  admin_manage_data() {}

  @Get('/test')
  @Render('admin/test')
  test_data() {}
}
