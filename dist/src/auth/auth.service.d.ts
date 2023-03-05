import { RedisService } from '@liaoliaots/nestjs-redis';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dtos/register-auth.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly mailerService;
    private readonly redisService;
    private readonly redisClient;
    constructor(userRepository: Repository<User>, jwtService: JwtService, configService: ConfigService, mailerService: MailerService, redisService: RedisService);
    checkEffective(userInfo: RegisterAuthDto): Promise<void>;
    checkingAccount(email: string): Promise<void>;
    sendingEmailAuthCode(email: string): Promise<boolean>;
    checkingEmailCode(email: string, emailAuthCode: string): Promise<void>;
    joinUser(email: string, password: string): Promise<{
        email: string;
        password: string;
    } & User>;
    makeAccessToken(id: number, email: string, userType: number): Promise<string>;
    makeRefreshToken(id: number, email: string, userType: number, clientIp: string): Promise<string>;
    checkLoginUser(email: string, password: string): Promise<User>;
    checkUserFromUserAccessToken(id: number, email: string, userType: number): Promise<User>;
    checkRefreshTokenInRedis(id: number, userType: number, ip: string, refreshToken: string): Promise<void>;
}
