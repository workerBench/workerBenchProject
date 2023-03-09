import {
  Controller,
  Post,
  Body,
  Res,
  UseInterceptors,
  BadRequestException,
  Get,
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { AdminUser } from 'src/entities/admin-user';
import { User } from 'src/entities/user';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dtos/admin-login.dto';
import { AdminRegisterJoinDto } from './dtos/admin-register-join';
import { AdminRemoveDto } from './dtos/admin-remove.dto';
import { AuthCodeForRePs } from './dtos/authcode-re-ps.dto';
import { CurrentAdminDto, CurrentUserDto } from './dtos/current-user.dto';
import { EmailForReset } from './dtos/email-re-ps.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { RegisterJoinDto } from './dtos/register-join';
import { ResetPassword } from './dtos/reset-password.dto';
import { JwtNormalAdminAuthGuard } from './jwt/access/admin/jwt-normal-admin-guard';
import { JwtSuperAdminAuthGuard } from './jwt/access/admin/jwt-super-admin-guard';
import { JwtTeacherAuthGuard } from './jwt/access/user/jwt-teacher-guard';
import { JwtUserAuthGuard } from './jwt/access/user/jwt-user-guard';
import { JwtAdminRefreshAuthGuard } from './jwt/refresh/admin/jwt-admin-refresh-guard';
import { JwtRefreshAuthGuard } from './jwt/refresh/user/jwt-user-refresh-guard';
import { TOKEN_NAME } from './naming/token-name';

@ApiTags('auth')
@UseInterceptors(SuccessInterceptor)
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 유저 회원가입 시도 시 유효성 검사
  @ApiResponse({
    status: 201,
    description: '성공',
  })
  @ApiOperation({ summary: '회원가입 - 인증 api' })
  @Post('register')
  async register(@Body() body: RegisterAuthDto) {
    try {
      // 유효성 검사
      await this.authService.checkEffective(body);
      // 중복 검사
      await this.authService.checkingAccount(body.email);
      // 이메일 인증 코드 발급. 발급된 인증코드는 redis 에 캐싱으로 저장
      await this.authService.sendingEmailAuthCode(body.email);

      return true;
    } catch (err) {
      // 에러가 string. 지역 에러
      throw new HttpException(`${err.message}`, 401);
      // 에러가 객체. 전역 에러
      // throw new BadRequestException(`${err.message}`);
    }
  }

  // 유저 회원가입 시도 시 유효성 검사 통과 후 실제 join
  @ApiResponse({
    status: 201,
    description: '성공',
    type: Boolean,
  })
  @ApiOperation({ summary: '회원가입 - join api' })
  @Post('register/join')
  async registerJoin(
    @Body() body: RegisterJoinDto,
    @Res({ passthrough: true }) response: Response,
    @RealIP() clientIp: string,
  ) {
    const { email, password, emailAuthCode } = body;

    try {
      // 이메일 인증코드 확인
      await this.authService.checkingEmailCode(email, emailAuthCode);
      // 회원가입 insert
      const createdUser = await this.authService.joinUser(email, password);
      // 가입 후 토큰 발행 - accessToken, refreshToken
      const accessToken = await this.authService.makeAccessToken(
        createdUser.id,
        createdUser.email,
        createdUser.user_type,
      );
      const refreshToken = await this.authService.makeRefreshToken(
        createdUser.id,
        createdUser.email,
        createdUser.user_type,
        clientIp,
      );
      response.cookie(TOKEN_NAME.userAccess, accessToken, { httpOnly: true });
      response.cookie(TOKEN_NAME.userRefresh, refreshToken, { httpOnly: true });
      return true;
    } catch (err) {
      throw new BadRequestException(`${err.message}`);
    }
  }

  // 유저, 강사 로그인
  @ApiResponse({
    status: 201,
    description: '성공',
    type: RegisterJoinDto,
  })
  @ApiOperation({ summary: '로그인 api' })
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
    @RealIP() clientIp: string,
  ) {
    const { email, password } = body;
    let userInfo: User;

    try {
      // 유저 찾기
      userInfo = await this.authService.checkLoginUser(email, password);
    } catch (err) {
      throw new BadRequestException(`${err.message}`);
    }

    // 검증 후 토큰 발행
    const accessToken = await this.authService.makeAccessToken(
      userInfo.id,
      userInfo.email,
      userInfo.user_type,
    );
    const refreshToken = await this.authService.makeRefreshToken(
      userInfo.id,
      userInfo.email,
      userInfo.user_type,
      clientIp,
    );

    response.cookie(TOKEN_NAME.userAccess, accessToken, { httpOnly: true });
    response.cookie(TOKEN_NAME.userRefresh, refreshToken, { httpOnly: true });

    return true;
  }

  // 유저 or 강사의 access token 에 문제가 있을 시 refresh token 검증 요청
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiResponse({
    status: 400,
    description: '실패',
  })
  @ApiOperation({
    summary: 'refresh token 이 유효하다면 access token 을 재발급',
  })
  @Get('refreshtoken/user')
  @UseGuards(JwtRefreshAuthGuard)
  async userRefreshCheck(
    @CurrentUser() user: CurrentUserDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @RealIP() clientIp: string,
  ) {
    try {
      // 사용자의 refresh token 을 가져온다
      const refreshToken = request.cookies[TOKEN_NAME.userRefresh];

      // cookie 의 refresh token 과 redis 의 refresh token 이 일치하는지 비교.
      await this.authService.checkRefreshTokenInRedis(
        user.id,
        user.user_type,
        clientIp,
        refreshToken,
      );

      // 토큰 검증에 문제가 없을 경우 access token 을 재발급 해준다.
      const accessToken = await this.authService.makeAccessToken(
        user.id,
        user.email,
        user.user_type,
      );

      response.cookie(TOKEN_NAME.userAccess, accessToken, { httpOnly: true });
      return true;
    } catch (err) {
      response.clearCookie(TOKEN_NAME.userAccess);
      response.clearCookie(TOKEN_NAME.userRefresh);
      throw new HttpException(`${err.message}`, 400);
    }
  }

  // 관리자 등록 (회원가입)
  @ApiResponse({
    status: 201,
    description: '성공',
  })
  @ApiOperation({ summary: '관리자 등록' })
  @Post('admin/register')
  async adminRegister(
    @Body() body: AdminRegisterJoinDto,
    @Res({ passthrough: true }) response: Response,
    @RealIP() clientIp: string,
  ) {
    try {
      // 유효성 검사
      await this.authService.checkEffectiveForAdmin(body);
      // 중복 검사
      await this.authService.checkingAdminAccount(body.email);
      // 가입
      const createdAdminUser = await this.authService.joinAdminUser(body);
      // 토큰 발행
      const accessToken = await this.authService.makeAccessTokenForAdmin(
        createdAdminUser.id,
        createdAdminUser.email,
        createdAdminUser.admin_type,
      );
      const refreshToken = await this.authService.makeRefreshTokenForAdmin(
        createdAdminUser.id,
        createdAdminUser.email,
        createdAdminUser.admin_type,
        clientIp,
      );
      // 토큰 쿠키에 삽입
      response.cookie(TOKEN_NAME.adminAccess, accessToken, { httpOnly: true });
      response.cookie(TOKEN_NAME.adminRefresh, refreshToken, {
        httpOnly: true,
      });

      return true;
    } catch (err) {
      // 에러가 string. 지역 에러
      throw new HttpException(`${err.message}`, 401);
    }
  }

  // 관리자 로그인
  @ApiResponse({
    status: 201,
    description: '성공',
    type: AdminLoginDto,
  })
  @ApiResponse({
    status: 400,
    description: '실패',
  })
  @ApiOperation({ summary: '관리자 로그인 api' })
  @Post('admin/login')
  async adminLogin(
    @Body() body: AdminLoginDto,
    @Res({ passthrough: true }) response: Response,
    @RealIP() clientIp: string,
  ) {
    const { email, password } = body;
    let adminInfo: AdminUser;

    try {
      // 유저 찾기
      adminInfo = await this.authService.checkLoginAdminUser(email, password);
    } catch (err) {
      throw new BadRequestException(`${err.message}`);
    }

    // 검증 후 토큰 발행
    const accessToken = await this.authService.makeAccessTokenForAdmin(
      adminInfo.id,
      adminInfo.email,
      adminInfo.admin_type,
    );
    const refreshToken = await this.authService.makeRefreshTokenForAdmin(
      adminInfo.id,
      adminInfo.email,
      adminInfo.admin_type,
      clientIp,
    );

    // 쿠키에 토큰 삽입
    response.cookie(TOKEN_NAME.adminAccess, accessToken, { httpOnly: true });
    response.cookie(TOKEN_NAME.adminRefresh, refreshToken, { httpOnly: true });

    return true;
  }

  // 관리자의 access token 에 문제가 있을 시 refresh token 검증 요청
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiResponse({
    status: 400,
    description: '실패',
  })
  @ApiOperation({
    summary: 'refresh token 이 유효하다면 access token 을 재발급',
  })
  @Get('refreshtoken/admin')
  @UseGuards(JwtAdminRefreshAuthGuard)
  async checkAdminRefresh(
    @CurrentUser() user: CurrentAdminDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @RealIP() clientIp: string,
  ) {
    try {
      // 관리자의 refresh token 을 가져온다
      const refreshToken = request.cookies[TOKEN_NAME.adminRefresh];
      // cookie 의 refresh token 과 redis 의 refresh token 이 일치하는지 비교.
      await this.authService.checkAdminRefreshTokenInRedis(
        user.id,
        user.admin_type,
        clientIp,
        refreshToken,
      );
      // 토큰 검증에 문제가 없을 경우 access token 을 재발급 해준다.
      const accessToken = await this.authService.makeAccessTokenForAdmin(
        user.id,
        user.email,
        user.admin_type,
      );
      response.cookie(TOKEN_NAME.adminAccess, accessToken, { httpOnly: true });
      return true;
    } catch (err) {
      response.clearCookie(TOKEN_NAME.adminAccess);
      response.clearCookie(TOKEN_NAME.adminRefresh);
      throw new HttpException(`${err.message}`, 400);
    }
  }

  // 관리자 삭제. 최고 관리자(super admin) 만 가능.
  @ApiResponse({
    status: 200,
    description: '성공',
    type: AdminRemoveDto,
  })
  @ApiOperation({ summary: '관리자 삭제' })
  @Post('admin/remove')
  async removeAdminAccount(@Body() body: AdminRemoveDto) {
    return await this.authService.removeAdmin(body.email);
  }

  // 유저 로그아웃
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '유저 로그아웃 api' })
  @Post('logout/user')
  async logOutUser(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(TOKEN_NAME.userAccess);
    response.clearCookie(TOKEN_NAME.userRefresh);
    return true;
  }

  // 관리자 로그아웃
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '관리자 로그아웃 api' })
  @Post('logout/admin')
  async logOutAdmin(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(TOKEN_NAME.adminAccess);
    response.clearCookie(TOKEN_NAME.adminRefresh);
    return true;
  }

  // 유저 비밀번호 재설정 하기 - 이메일을 입력하여 재설정 시도
  @ApiResponse({
    status: 201,
    description:
      '비밀번호 재설정 시도 시 이메일 입력 후 해당 이메일이 가입자라면 인증코드 발송',
  })
  @ApiOperation({
    summary: '유저 비밀번호 재설정 하기 - 이메일을 입력하여 재설정 시도',
  })
  @Post('resetps/email')
  @UseGuards(JwtUserAuthGuard)
  async emailForResetPassWord(
    @Body() body: EmailForReset,
    @CurrentUser() user: CurrentUserDto,
  ) {
    try {
      // 이메일의 존재유무 검증
      await this.authService.findByEmail(body.email, user.id);
      // 이메일이 존재한다면, 해당 이메일로 인증번호 발송
      await this.authService.sendingEmailResetCode(body.email);
      return;
    } catch (err) {
      throw new HttpException(`${err.message}`, 400);
    }
  }

  // 유저 비밀번호 재설정 하기 - 이메일 인증코드 입력
  @ApiResponse({
    status: 201,
    description: '비밀번호 재설정 시도 시 이메일 인증코드 입력 - 성공',
  })
  @ApiResponse({
    status: 400,
    description:
      '비밀번호 재설정 시도 시 이메일 인증코드 입력 - 코드 불일치로 인한 실패',
  })
  @ApiOperation({
    summary: '유저 비밀번호 재설정 하기 - 이메일 인증코드 발송',
  })
  @Post('resetps/email/code')
  @UseGuards(JwtUserAuthGuard)
  async authCodeForResetPassword(
    @Body() body: AuthCodeForRePs,
    @CurrentUser() user: CurrentUserDto,
  ) {
    try {
      // 입력받은 이메일 인증번호 검증
      await this.authService.checkingResetCode(
        body.email,
        body.emailAuthCode,
        user.id,
      );
      return;
    } catch (err) {
      throw new HttpException(`${err.message}`, 400);
    }
  }

  // 유저 비밀번호 재설정 - 이메일 인증 완료 후 비밀번호 재설정
  @ApiResponse({
    status: 201,
    description: '비밀번호 재설정 - 성공',
  })
  @ApiResponse({
    status: 400,
    description: '비밀번호 재설정 - 적합하지 않은 비밀번호 입력 시 실패',
  })
  @Post('resetps/password')
  @UseGuards(JwtUserAuthGuard)
  async resetPassword(
    @Body() body: ResetPassword,
    @CurrentUser() user: CurrentUserDto,
  ) {
    try {
      // 해당 유저가 진정 이메일 인증 절차를 진행하여 비밀번호를 재설정 하려 하는 것인지 검사
      await this.authService.checkResetPsOnTheWay(user.id, user.email);
      // 입력받은 비밀번호, 확인용 비밀번호 2가지 유효성 검사
      await this.authService.checkEffectiveForResetPs(body);
      // 유효성 검사 후 비밀번호 실제 변경.
      await this.authService.changePassword(body.password, user.id, user.email);
      return;
    } catch (err) {
      throw new HttpException(`${err.message}`, 400);
    }
  }

  /* -------------------------------- 테스트용 API -------------------------------- */

  // 유저 테스트
  @Get('test')
  @UseGuards(JwtUserAuthGuard)
  async test22(@CurrentUser() user: CurrentUserDto) {
    console.log('---- 테스트 잘 작동함!');
    console.log(user);
    return;
  }

  // 강사 테스트
  @Get('test2')
  @UseGuards(JwtTeacherAuthGuard)
  async test233(@CurrentUser() user: CurrentUserDto) {
    console.log('---- 테스트 잘 작동함!');
    console.log(user.id);
    return;
  }

  // 부 관리자 테스트
  @Get('admintest')
  @UseGuards(JwtNormalAdminAuthGuard)
  async test66(@CurrentUser() admin: CurrentAdminDto) {
    console.log('부 관리자 테스트!');
    console.log(admin);
  }

  // 최고 관리자 테스트
  @Get('superadmintest')
  @UseGuards(JwtSuperAdminAuthGuard)
  async test77(@CurrentUser() admin: CurrentAdminDto) {
    console.log('최고 관리자 테스트!');
    console.log(admin);
  }
}
