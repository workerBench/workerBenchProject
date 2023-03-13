import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtNormalAdminPageGuard extends AuthGuard('adminRefreshToken') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // 만약 토큰이 불량 상태라면 user 는 false
  handleRequest(err: any, user: any, info: any) {
    if (!user) {
      return false;
    }
    return user;
  }
}
