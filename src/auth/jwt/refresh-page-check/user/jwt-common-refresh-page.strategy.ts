import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { jwtUserRefreshTokenFromCookie } from 'src/common/utils/jwtExtractorFromCookies';
import { JwtPayload } from '../../payload/jwt.payload';

@Injectable()
export class JwtRefreshCheckStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        jwtUserRefreshTokenFromCookie,
      ]),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.authService.checkUserFromUserAccessToken(
        payload.id,
        payload.email,
        payload.userType,
      );
      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
