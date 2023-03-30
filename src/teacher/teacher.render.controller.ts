import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
import { JwtTeacherPageGuard } from 'src/auth/jwt/refresh-page-check/user/jwt-teacher-page-guard';
import { JwtUserPageGuard } from 'src/auth/jwt/refresh-page-check/user/jwt-user-page-guard';
import { TOKEN_NAME } from 'src/auth/naming/token-name';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@ApiTags('z-page-render')
@Controller('teacher')
export class TeacherControllerRender {
  constructor(private readonly authService: AuthService) {}

  // 수강 문의 관리 페이지 - 미완료
  @Get('/manage/incomplete')
  @UseGuards(JwtTeacherPageGuard)
  async q(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-teacher-auth', { user: false });
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
        return res.render('teacher/teacher-manage-incomplete', {
          user: user,
        });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // 유저 -> 강사 등록 페이지
  @Get('/register')
  @UseGuards(JwtUserPageGuard)
  async b(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-login', { user: false });
    }
    if (typeof user === 'object' && user.user_type === 1) {
      return res.render('auth/already-teacher', { user: user });
    }

    if (typeof user === 'object' && user.user_type === 0) {
      try {
        const refreshToken = req.cookies[TOKEN_NAME.userRefresh];
        // refresh 토큰 인증 검사
        await this.authService.checkRefreshTokenInRedis(
          user.id,
          user.user_type,
          clientIp,
          refreshToken,
        );
        return res.render('teacher/teacher-register', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // 강사 및 업체 정보
  @Get('/workshop/information')
  @UseGuards(JwtTeacherPageGuard)
  async c(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-teacher-auth', { user: false });
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
        return res.render('teacher/teacher-workshop-information', {
          user: user,
        });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // 등록된 모든 워크샵 목록
  @Get('/workshop')
  @UseGuards(JwtTeacherPageGuard)
  async d(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-teacher-auth', { user: false });
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
        return res.render('teacher/teacher-workshop', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // 워크샵(상품) 등록 페이지
  @Get('/workshop/register')
  @UseGuards(JwtTeacherPageGuard)
  async e(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-teacher-auth', { user: false });
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
        // 해당 강사가 업체를 가지고 있는지, 혹은 소속되어 있는지 체크.
        const companyResut = await this.authService.checkTeacherCompany(
          user.id,
        );
        if (companyResut === false) {
          return res.render('auth/go-to-register-company', { user: user });
        }

        return res.render('teacher/workshop-register', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // 강사 업체 등록 (강사 고유의 업체 등록)
  @Get('/company/register')
  @UseGuards(JwtTeacherPageGuard)
  async f(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-teacher-auth', { user: false });
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
        // 강사의 affiliation_company_id 가 0인지 확인.
        const teacherUser = await this.authService.getTeacherById(user.id);
        if (teacherUser.affiliation_company_id !== 0) {
          return res.render('auth/already-teacher-affiliation', { user: user });
        }
        // 강사가 company 를 이미 가지고 있는지 확인
        const isTeacherHaveCompany = await this.authService.getTeachersCompany(
          user.id,
        );
        if (isTeacherHaveCompany) {
          return res.render('auth/already-teacher-have-company', {
            user: user,
          });
        }
        // 소속된 업체도, 고유로 등록한 업체도 없다면 업체 등록 페이지로.
        return res.render('teacher/company-register', { user: user });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }

  // 수강 문의 관리 페이지 - 완료
  @Get('/manage/complete')
  @UseGuards(JwtTeacherPageGuard)
  async a(
    @CurrentUser() user: CurrentUserDto | boolean,
    @Req() req: Request,
    @Res() res: Response,
    @RealIP() clientIp: string,
  ) {
    if (typeof user === 'boolean' && user === false) {
      return res.render('auth/non-teacher-auth', { user: false });
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
        return res.render('teacher/teacher-manage-complete', {
          user: user,
        });
      } catch (err) {
        res.clearCookie(TOKEN_NAME.userAccess);
        res.clearCookie(TOKEN_NAME.userRefresh);
        return res.render('auth/non-login', { user: false });
      }
    }
  }
}
