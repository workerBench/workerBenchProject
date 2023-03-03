import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
  // UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { JwtRefreshAuthGuard } from './jwt.refreshGuard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // 만약 토큰이 불량 상태라면 user 는 false
  handleRequest(err: any, user: any, info: any) {
    console.log('1111');
    console.log(user);
    if (user) {
      return user;
    }
    console.log('뭔가 문제가 생김...');
    throw new UnauthorizedException('accessToken is not valid');
  }
}

//* guard -> strategy
