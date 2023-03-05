import { RedisService } from '@liaoliaots/nestjs-redis';
import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  emailAuthCodeRedisKey,
  refreshTokenRedisKey,
} from './naming/redis-key-name';
import { userTypeNaming } from './naming/user-type';

@Injectable()
export class AuthService {
  private readonly redisClient: Redis;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = redisService.getClient();
  }

  // 회원가입 시 유효성 검사
  async checkEffective(userInfo: RegisterAuthDto) {
    const { email, password, authentNum } = userInfo;

    if (!email || !email.includes('@') || !email.includes('.')) {
      const err = new Error('이메일 형식이 올바르지 않습니다.');
      err.name = 'WrongEmailError';
      throw err;
    }
    if (password !== authentNum) {
      const err = new Error('패스워드가 일치하지 않습니다.');
      err.name = 'WrongPasswordError';
      throw err;
    }
    if (password.length < 4) {
      const err = new Error('패스워드가 짧습니다.');
      err.name = 'WrongPasswordError';
      throw err;
    }
  }

  // 회원가입 시 이메일 중복 검사
  async checkingAccount(email: string) {
    const check_email = await this.userRepository.findOne({ where: { email } });
    if (check_email) {
      const err = new Error('이미 존재하는 이메일 입니다.');
      err.name = 'DuplicationEmailError';
      throw err;
    }
  }

  // 회원가입 시 이메일 인증코드 발송
  async sendingEmailAuthCode(email: string) {
    const auth_num = randomBytes(3).toString('hex');
    await this.redisClient.setex(emailAuthCodeRedisKey(email), 300, auth_num); // redis set

    this.mailerService
      .sendMail({
        to: email,
        from: this.configService.get('GOOGLE_MAIL'),
        subject: 'workshop 회원가입 이메일 인증',
        html: `<h1>인증번호 : ${auth_num}</h1>`,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
        throw new ConflictException();
      });
    return true;
  }

  // 회원가입 시 이메일 인증코드 검사
  async checkingEmailCode(email: string, emailAuthCode: string) {
    const authCodeOfRedis = await this.redisClient.get(
      emailAuthCodeRedisKey(email),
    );
    if (authCodeOfRedis !== emailAuthCode) {
      const err = new Error('입력하신 인증번호가 적합하지 않습니다.');
      err.name = 'WrongEmailAuthCode';
      throw err;
    }
    return;
  }

  // 회원가입 시 실제로 DB 에 insert
  async joinUser(email: string, password: string) {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 12);
    // 회원가입
    const saveResult = await this.userRepository.save({
      email,
      password: hashedPassword,
    });
    return saveResult;
  }

  // 유저 or 강사 access token 발행
  async makeAccessToken(id: number, email: string, userType: number) {
    const accessToekn = await this.jwtService.signAsync(
      { id, email, userType },
      {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: '60s',
        algorithm: 'HS256',
      },
    );
    return accessToekn;
  }

  // 유저 or 강사 refresh token 발행
  async makeRefreshToken(
    id: number,
    email: string,
    userType: number,
    clientIp: string,
  ) {
    let userTypeString: string;
    if (userType === 0) {
      userTypeString = userTypeNaming.user;
    }
    if (userType === 1) {
      userTypeString = userTypeNaming.teacher;
    }

    const refreshToekn = await this.jwtService.signAsync(
      { id, email, userType },
      {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: '100s',
        algorithm: 'HS256',
      },
    );
    await this.redisClient.setex(
      refreshTokenRedisKey(userTypeString, id),
      100,
      `${clientIp}_${refreshToekn}`,
    );
    return refreshToekn;
  }

  // 로그인 시 유저 정보 DB 체크
  async checkLoginUser(email: string, password: string) {
    const userInfo = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'user_type'],
    });
    if (!userInfo) {
      const err = new Error('이메일 또는 비밀번호가 일치하지 않습니다');
      err.name = 'DoesntExistEmailOrPasswordError';
      throw err;
    }

    if (!(await bcrypt.compare(password, userInfo.password))) {
      const err = new Error('이메일 또는 비밀번호가 일치하지 않습니다');
      err.name = 'DoesntExistEmailOrPasswordError';
      throw err;
    }

    return userInfo;
  }

  // user access token 에서 id 와 email 로 user 검사
  async checkUserFromUserAccessToken(
    id: number,
    email: string,
    userType: number,
  ) {
    const userInfo = await this.userRepository.findOne({
      where: { id, email, user_type: userType },
      select: ['id', 'email', 'user_type', 'isBan'],
    });

    return userInfo;
  }

  // redis 의 refresh token 검사
  async checkRefreshTokenInRedis(
    id: number,
    userType: number,
    ip: string,
    refreshToken: string,
  ) {
    let userTypeString: string;
    if (userType === 0) {
      userTypeString = userTypeNaming.user;
    }
    if (userType === 1) {
      userTypeString = userTypeNaming.teacher;
    }

    const clientInfoFromRedis = (
      await this.redisClient.get(refreshTokenRedisKey(userTypeString, id))
    ).split('_');

    if (clientInfoFromRedis[0] !== ip) {
      const err = new Error('사용자의 ip 정보가 정확하지 않습니다');
      err.name = 'IpDoesntSame';
      throw err;
    }

    if (clientInfoFromRedis[1] !== refreshToken) {
      const err = new Error('사용자의 토큰 정보가 정확하지 않습니다');
      err.name = 'IpDoesntSame';
      throw err;
    }

    return;
  }
}
