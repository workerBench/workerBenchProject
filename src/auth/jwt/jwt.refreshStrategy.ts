import { JwtPayload } from './payload/jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { jwtRefreshExtractorFromCookies } from 'src/common/utils/jwtRefreshExtractorFromCookies';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    // jwt 가드가 실행되면 strategy 가 호출되고, 이어서 validate 함수가 실행된다. 이때 super() 에 담겨 있는 jwt 설정들을 참조하면서 토큰 유효성을 검증한다.
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        jwtRefreshExtractorFromCookies,
      ]), // 헤더의 쿠키로부터 jwt 를 추출한다.
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  // 가드를 통해 들어와 super 에서 처리되어 반환된 jwt 토큰이 payload에 담겨 있을 거야.
  async validate(payload: JwtPayload) {
    console.log('99999 여긴 리프레쉬 스트레트지');
    console.log(payload);
    try {
      return { email: 'test', payload };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
