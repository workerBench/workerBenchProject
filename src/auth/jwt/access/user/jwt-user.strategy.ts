import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { jwtUserTokenFromCookie } from 'src/common/utils/jwtExtractorFromCookies';
import { JwtPayload } from '../../payload/jwt.payload';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(
  Strategy,
  'userAccessToken',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    // jwt 가드가 실행되면 strategy 가 호출되고, 이어서 validate 함수가 실행된다. 이때 super() 에 담겨 있는 jwt 설정들을 참조하면서 토큰 유효성을 검증한다.
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtUserTokenFromCookie]), // 헤더의 쿠키로부터 jwt 를 추출한다.
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  // 가드를 통해 들어와 super 에서 처리되어 반환된 jwt 토큰이 payload에 담겨 있을 거야. 참고로 이건 성공 케이스.
  async validate(payload: JwtPayload) {
    try {
      const user = await this.authService.checkUserFromUserAccessToken(
        payload.id,
        payload.email,
        payload.userType,
      );
      if (!user) {
        throw new Error('해당하는 유저는 없습니다.');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
