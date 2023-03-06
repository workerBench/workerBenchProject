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
import { User } from 'src/entities/user';
import { AuthService } from './auth.service';
import { CurrentUserDto } from './dtos/current-user.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { RegisterJoinDto } from './dtos/register-join';
import { JwtTeacherAuthGuard } from './jwt/access/user/jwt-teacher-guard';
import { JwtUserAuthGuard } from './jwt/access/user/jwt-user-guard';
import { JwtRefreshAuthGuard } from './jwt/refresh/user/jwt-user-refresh-guard';

@ApiTags('auth')
@UseInterceptors(SuccessInterceptor)
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입 시도 시 유효성 검사
  @ApiResponse({
    status: 200,
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

  // 회원가입 시도 시 유효성 검사 통과 후 실제 join
  @ApiResponse({
    status: 200,
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
      response.cookie('userAccessToken', accessToken, { httpOnly: true });
      response.cookie('refreshToken', refreshToken, { httpOnly: true });
      return true;
    } catch (err) {
      throw new BadRequestException(`${err.message}`);
    }
  }

  // 유저, 강사 로그인
  @ApiResponse({
    status: 200,
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
    const accessToekn = await this.authService.makeAccessToken(
      userInfo.id,
      userInfo.email,
      userInfo.user_type,
    );
    const refreshToekn = await this.authService.makeRefreshToken(
      userInfo.id,
      userInfo.email,
      userInfo.user_type,
      clientIp,
    );

    response.cookie('userAccessToken', accessToekn, { httpOnly: true });
    response.cookie('refreshToken', refreshToekn, { httpOnly: true });

    return true;
  }

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

  // 유저 or 강사의 access token 에 문제가 있을 시 refresh token 검증 요청
  @ApiOperation({
    summary: 'refresh token 이 유효하다면 access token 을 재발급',
  })
  @Get('refreshtoken/user')
  @UseGuards(JwtRefreshAuthGuard)
  async test44(
    @CurrentUser() user: CurrentUserDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @RealIP() clientIp: string,
  ) {
    try {
      // 사용자의 refresh token 을 가져온다
      const refreshToken = request.cookies['refreshToken'];

      // cookie 의 refresh token 과 redis 의 refresh token 이 일치하는지 비교.
      await this.authService.checkRefreshTokenInRedis(
        user.id,
        user.user_type,
        clientIp,
        refreshToken,
      );

      // 토큰 검증에 문제가 없을 경우 access token 을 재발급 해준다.
      const accessToekn = await this.authService.makeAccessToken(
        user.id,
        user.email,
        user.user_type,
      );

      response.cookie('userAccessToken', accessToekn, { httpOnly: true });
      return true;
    } catch (err) {
      throw new HttpException('로그인 토큰의 정보가 올바르지 않습니다', 400);
    }
  }
}
