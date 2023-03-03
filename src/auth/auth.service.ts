import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
  private readonly redisClient: Redis;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = redisService.getClient();
  }

  async verifyUserAndSignJwtAccess() {
    const user_id = 1;
    const accessJwt = await this.jwtService.signAsync(
      { user_id: user_id },
      { secret: this.configService.get('JWT_SECRET_KEY'), expiresIn: '20s' },
    );

    return accessJwt;
  }

  async verifyUserAndSignJwtRefresh() {
    const refreshJwt = await this.jwtService.signAsync(
      { user_id: 'refresh_test' },
      { secret: this.configService.get('JWT_SECRET_KEY'), expiresIn: '200s' },
    );
    this.redisClient.setex('refresh_test', 200, refreshJwt); // redis set
    return refreshJwt;
  }

  async getRefreshTokenFromRedis() {
    return this.redisClient.get('refresh_test'); // redis get
  }
}
