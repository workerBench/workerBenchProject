import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  // UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('refreshToken') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('32312321');
    console.log(user);
    if (err || !user) {
      console.log('여긴 리프레쉬 가드!');
      throw new UnauthorizedException('인증 문제가 있습니다.');
    }
    return user;
  }
}

//* guard -> strategy
