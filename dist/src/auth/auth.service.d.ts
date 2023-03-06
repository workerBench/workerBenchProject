import { RedisService } from '@liaoliaots/nestjs-redis';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { AdminUser } from 'src/entities/admin-user';
import { AdminRegisterJoinDto } from './dtos/admin-register-join';
export declare class AuthService {
    private readonly userRepository;
    private readonly adminUserRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly mailerService;
    private readonly redisService;
    private readonly redisClient;
    constructor(userRepository: Repository<User>, adminUserRepository: Repository<AdminUser>, jwtService: JwtService, configService: ConfigService, mailerService: MailerService, redisService: RedisService);
    checkEffective(userInfo: RegisterAuthDto): Promise<void>;
    checkEffectiveForAdmin(adminInfo: AdminRegisterJoinDto): Promise<void>;
    checkingAccount(email: string): Promise<void>;
    checkingAdminAccount(email: string): Promise<void>;
    sendingEmailAuthCode(email: string): Promise<boolean>;
    checkingEmailCode(email: string, emailAuthCode: string): Promise<void>;
    joinUser(email: string, password: string): Promise<{
        email: string;
        password: string;
    } & User>;
    joinAdminUser(adminInfo: AdminRegisterJoinDto): Promise<{
        email: string;
        password: string;
        name: string;
        phone_number: string;
    } & AdminUser>;
    makeAccessToken(id: number, email: string, userType: number): Promise<string>;
    makeAccessTokenForAdmin(id: number, email: string, adminType: number): Promise<string>;
    makeRefreshToken(id: number, email: string, userType: number, clientIp: string): Promise<string>;
    makeRefreshTokenForAdmin(id: number, email: string, adminType: number, clientIp: string): Promise<string>;
    checkLoginUser(email: string, password: string): Promise<User>;
    checkLoginAdminUser(email: string, password: string): Promise<AdminUser>;
    checkUserFromUserAccessToken(id: number, email: string, userType: number): Promise<User>;
    checkAdminFromAdminAccessToken(id: number, email: string, adminType: number): Promise<AdminUser>;
    checkRefreshTokenInRedis(id: number, userType: number, ip: string, refreshToken: string): Promise<void>;
    checkAdminRefreshTokenInRedis(id: number, adminType: number, ip: string, refreshToken: string): Promise<void>;
    removeAdmin(email: string): Promise<void>;
}
