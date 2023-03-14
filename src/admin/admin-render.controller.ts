import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { AuthService } from 'src/auth/auth.service';
import { CurrentAdminDto } from 'src/auth/dtos/current-user.dto';
import { JwtNormalAdminPageGuard } from 'src/auth/jwt/refresh-page-check/admin/jwt-normal-admin-page-guard';
import { JwtSuperAdminPageGuard } from 'src/auth/jwt/refresh-page-check/admin/jwt-super-admin-page-guard';
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
        res.clearCookie(TOKEN_NAME.adminAccess);
        res.clearCookie(TOKEN_NAME.adminRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // ----------------- 워크숍 관리 페이지 렌더 ----------------- //

  @Get('/workshops-request')
  @UseGuards(JwtNormalAdminPageGuard)
  async request_workshops_data(
    @CurrentUser() user: CurrentAdminDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-login', { user: false });
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
        return res.render('admin/workshops-request', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.adminAccess);
        res.clearCookie(TOKEN_NAME.adminRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  @Get('/workshops-approval')
  @UseGuards(JwtNormalAdminPageGuard)
  async approval_workshops_data(
    @CurrentUser() user: CurrentAdminDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-login', { user: false });
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
        return res.render('admin/workshops-approval', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.adminAccess);
        res.clearCookie(TOKEN_NAME.adminRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  @Get('/workshops-finished')
  @UseGuards(JwtNormalAdminPageGuard)
  async finished_workshops_data(
    @CurrentUser() user: CurrentAdminDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-login', { user: false });
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
        return res.render('admin/workshops-finished', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.adminAccess);
        res.clearCookie(TOKEN_NAME.adminRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // ----------------- 유저 및 업체 관리 페이지 렌더 ----------------- //

  @Get('/black-register')
  @UseGuards(JwtNormalAdminPageGuard)
  async black_register_data(
    @CurrentUser() user: CurrentAdminDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-login', { user: false });
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
        return res.render('admin/black-register', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.adminAccess);
        res.clearCookie(TOKEN_NAME.adminRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  @Get('/black-list')
  @UseGuards(JwtNormalAdminPageGuard)
  async black_list_data(
    @CurrentUser() user: CurrentAdminDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-login', { user: false });
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
        return res.render('admin/black-list', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.adminAccess);
        res.clearCookie(TOKEN_NAME.adminRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // ----------------- 관리자 계정 관리 페이지 렌더 ----------------- //

  @Get('/admin-manage')
  @UseGuards(JwtSuperAdminPageGuard)
  async admin_manage_data(
    @CurrentUser() user: CurrentAdminDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-auth-or-login-admin', { user: false });
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
        return res.render('admin/admin-manage', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.adminAccess);
        res.clearCookie(TOKEN_NAME.adminRefresh);
        return res.render('auth/non-auth-or-login-admin', { user: false });
      }
    }
  }
}
