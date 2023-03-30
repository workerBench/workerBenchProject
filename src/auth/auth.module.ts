import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AuthController } from './auth.controller';
import { AuthControllerRender } from './auth.render.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { AdminUser } from 'src/entities/admin-user';
import { MailerModule } from '@nestjs-modules/mailer';
import { nodeMailerOption } from 'src/config/nodemailer.service';
import { JwtUserStrategy } from './jwt/access/user/jwt-user.strategy';
import { JwtRefreshStrategy } from './jwt/refresh/user/jwt-user-refresh.strategy';
import { JwtAdminStrategy } from './jwt/access/admin/jwt-admin.strategy';
import { JwtAdminRefreshStrategy } from './jwt/refresh/admin/jwt-admin-refresh.strategy';
import { Teacher } from 'src/entities/teacher';
import { Company } from 'src/entities/company';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: [
        'userAccessToken',
        'refreshToken',
        'adminAccessToken',
        'adminRefreshToken',
      ],
      session: false,
    }),
    TypeOrmModule.forFeature([User, AdminUser, Teacher, Company]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: nodeMailerOption,
    }),
    RedisModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController, AuthControllerRender],
  providers: [
    AuthService,
    JwtUserStrategy,
    JwtRefreshStrategy,
    JwtAdminStrategy,
    JwtAdminRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
