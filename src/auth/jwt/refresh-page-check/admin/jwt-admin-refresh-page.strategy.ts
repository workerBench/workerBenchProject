import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { jwtAdminRefreshTokenFromCookie } from 'src/common/utils/jwtExtractorFromCookies';
import { JwtPayload } from '../../payload/jwt.payload';

@Injectable()
export class JwtAdminRefreshCheckStrategy extends PassportStrategy(
  Strategy,
  'adminRefreshToken',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        jwtAdminRefreshTokenFromCookie,
      ]),
      secretOrKey: configService.get('JWT_SECRET_KEY_ADMIN'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const admin = await this.authService.checkAdminFromAdminAccessToken(
        payload.id,
        payload.email,
        payload.adminType,
      );
      return admin;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
