import { JwtPayload } from './payload/jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtExtractorFromCookies } from '../../common/utils/jwtExtractorFromCookies';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { jwtRefreshExtractorFromCookies } from 'src/common/utils/jwtRefreshExtractorFromCookies';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    // jwt 가드가 실행되면 strategy 가 호출되고, 이어서 validate 함수가 실행된다. 이때 super() 에 담겨 있는 jwt 설정들을 참조하면서 토큰 유효성을 검증한다.
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractorFromCookies]), // 헤더의 쿠키로부터 jwt 를 추출한다.
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  // 가드를 통해 들어와 super 에서 처리되어 반환된 jwt 토큰이 payload에 담겨 있을 거야. 참고로 이건 성공 케이스.
  async validate(payload: JwtPayload) {
    try {
      console.log('문제가 없다면 스트레트지로.');
      console.log(payload);
      console.log('------');
      return { email: 'test', payload };
    } catch (error) {
      console.log('스트레트지 에러');
      throw new UnauthorizedException(error);
    }
  }
}
