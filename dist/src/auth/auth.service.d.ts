import { RedisService } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    private readonly redisService;
    private readonly redisClient;
    constructor(jwtService: JwtService, configService: ConfigService, redisService: RedisService);
    verifyUserAndSignJwtAccess(): Promise<string>;
    verifyUserAndSignJwtRefresh(): Promise<string>;
    getRefreshTokenFromRedis(): Promise<string>;
}
