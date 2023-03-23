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
  Render,
  UploadedFiles,
  UploadedFile,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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

type NewType = Express.Multer.File;

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
      //throw new BadRequestException({}, `베드 리퀘스트임!`);
      throw err;
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
      throw err;
    }
  }

  // 유저, 강사 로그인
  @ApiResponse({
    status: 201,
    description: '성공',
    type: RegisterJoinDto,
  })
  @ApiOperation({ summary: '로그인 api' })
  @Post('login/user')
  async login(
    @Body() body: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @RealIP() clientIp: string,
  ) {
    const { email, password } = body;
    let userInfo: User;

    try {
      // 유저가 로그인 한 뒤 뒤로가기 버튼으로 다시 로그인 화면으로 돌아와 재차 로그인을 시도할 경우
      // 사용자의 refresh token 을 가져온다. 존재한다면, 쿠키를 삭제하고 다시 로그인하라 지시.
      const refreshToken = request.cookies[TOKEN_NAME.userRefresh];
      if (refreshToken) {
        response.clearCookie(TOKEN_NAME.userAccess);
        response.clearCookie(TOKEN_NAME.userRefresh);
        throw new BadRequestException(
          '기존의 로그인 기록이 남아있는 상태입니다. 로그인 재시도 부탁드립니다.',
        );
      }
      // 유저 찾기
      userInfo = await this.authService.checkLoginUser(email, password);
    } catch (err) {
      throw err;
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

  // 관리자 등록 (최고 관리자 권한)
  @ApiResponse({
    status: 201,
    description: '성공',
  })
  @ApiOperation({ summary: '관리자 등록' })
  @Post('admin')
  @UseGuards(JwtSuperAdminAuthGuard)
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
  @Post('login/admin')
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
  @Delete('admin')
  @UseGuards(JwtSuperAdminAuthGuard)
  async removeAdminAccount(@Body() body: AdminRemoveDto) {
    return await this.authService.removeAdmin(body.email);
  }

  // 유저 로그아웃
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '유저 로그아웃 api' })
  @Get('logout/user')
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
  @Get('logout/admin')
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
  @Post('reset-password')
  async emailForResetPassWord(@Body() body: EmailForReset) {
    try {
      // 이메일의 존재유무 검증
      await this.authService.findByEmail(body.email);
      // 이메일이 존재한다면, 해당 이메일로 인증번호 발송
      await this.authService.sendingEmailResetCode(body.email);
      return;
    } catch (err) {
      throw err;
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
  @Post('reset-password/email-code')
  async authCodeForResetPassword(
    @Body() body: AuthCodeForRePs,
    @Res({ passthrough: true }) response: Response,
    @RealIP() clientIp: string,
  ) {
    try {
      // 입력받은 이메일 인증번호 검증. 검증이 완료되면 비밀번호 재설정 절차에 진입한다.
      await this.authService.checkingResetCode(
        body.email,
        body.emailAuthCode,
        clientIp,
      );
      // 이메일을 잠시 쿠키에 저장
      response.cookie(TOKEN_NAME.emailForChangePs, body.email);
      return;
    } catch (err) {
      throw err;
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
  @Patch('reset-password')
  async resetPassword(
    @Body() body: ResetPassword,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @RealIP() clientIp: string,
  ) {
    try {
      // 해당 유저가 진정 이메일 인증 절차를 진행하여 비밀번호를 재설정 하려 하는 것인지 검사
      const email = request.cookies[TOKEN_NAME.emailForChangePs];
      await this.authService.checkResetPsOnTheWay(email, clientIp);

      // 입력받은 비밀번호, 확인용 비밀번호 2가지 유효성 검사
      await this.authService.checkEffectiveForResetPs(body);

      // 유효성 검사 후 비밀번호 실제 변경.
      await this.authService.changePassword(email, body.password);

      // 변경된 비밀번호로 재로그인 하기 위해 쿠키를 지워준다.
      response.clearCookie('emailForChangePassword');
      response.clearCookie(TOKEN_NAME.userAccess);
      response.clearCookie(TOKEN_NAME.userRefresh);
      return;
    } catch (err) {
      throw err;
    }
  }

  /* -------------------------------- 테스트용 API -------------------------------- */

  // // 유저 테스트
  // @Get('test')
  // @UseGuards(JwtUserAuthGuard)
  // async test22(@CurrentUser() user: CurrentUserDto) {
  //   return;
  // }

  // // 강사 테스트
  // @Get('test2')
  // @UseGuards(JwtTeacherAuthGuard)
  // async test233(@CurrentUser() user: CurrentUserDto) {
  //   return;
  // }

  // // 부 관리자 테스트
  // @Get('admintest')
  // @UseGuards(JwtNormalAdminAuthGuard)
  // async test66(@CurrentUser() admin: CurrentAdminDto) {}

  // // 최고 관리자 테스트
  // @Get('superadmintest')
  // @UseGuards(JwtSuperAdminAuthGuard)
  // async test77(@CurrentUser() admin: CurrentAdminDto) {}

  /* -------------------------------- S3 업로드 테스트용  API -------------------------------- */

  // S3 - cloudFront 실험 api - 데이터 받아오기
  // @Post('img-s3-test')
  // @UseInterceptors(
  //   FilesInterceptor('images', 4, { limits: { fileSize: 5 * 1024 * 1024 } }),
  // ) // 두번째 인자는 'images' 라는 이름에 담길 수 있는 총 파일 갯수. 즉 4면 4개 까지만 보낼 수 있어.
  // async uploadFileTest(
  //   @UploadedFiles() images: Array<Express.Multer.File>,
  //   @Body() body: any,
  // ) {
  //   // 사진 용량이 예를 들어 127KB 라면, 사이즈가 127000 바이트로 나옴. 참고로 limit 의 fileSize 는 단위가 바이트
  //   // FilesInterceptor('images', 4, { limits: { fileSize: 100000 } }), 이렇게면, images 이름으로 파일이 총 4개 들어올 수 있으며, 사이즈는 100,000 바이트, 즉 100KB 까지만 허락한다.
  //   // FilesInterceptor('images', 4, { limits: { fileSize: 5 * 1024 * 1024 } }), 위랑 같은데 이 경우 각 파일당 용량 제한이 5MB

  //   await this.authService.uploadFileToS3(images, JSON.parse(body.jsonData));
  //   return true;
  // }
}
