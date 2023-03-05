import { RedisService } from '@liaoliaots/nestjs-redis';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { AdminUser } from 'src/entities/admin-user';
import { Repository } from 'typeorm';

@Injectable()
export class AuthAdminService {
  private readonly redisClient: Redis;
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepository: Repository<AdminUser>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = redisService.getClient();
  }
}
