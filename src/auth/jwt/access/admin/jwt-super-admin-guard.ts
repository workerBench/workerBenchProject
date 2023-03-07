import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtSuperAdminAuthGuard extends AuthGuard('adminAccessToken') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // 만약 토큰이 불량 상태라면 user 는 false
  handleRequest(err: any, user: any, info: any) {
    if (!user || user.admin_type !== 1) {
      throw new UnauthorizedException('accessToken is not valid');
    }
    return user;
  }
}
