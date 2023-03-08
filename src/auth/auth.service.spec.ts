import { RedisService } from '@liaoliaots/nestjs-redis';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { AdminUser } from 'src/entities/admin-user';
import { User } from 'src/entities/user';
import { AuthService } from './auth.service';

const mockJwt = '31k4hjk3';

// User repository 에서 사용될 목 함수
class MockUserRepository {}

// Admin repository 에서 사용될 목 함수
class MockAdminUserRepository {}

// Jwt service 에서 사용될 목 함수
const mockJwtService = () => ({
  signAsync: jest.fn().mockResolvedValue(mockJwt),
});

// config service 에서 사용될 목 함수
const mockConfigService = () => ({
  get: jest.fn().mockReturnValue('thisissecretkey'),
});

// Mailer service 에서 사용될 목 함수
const mockMailerService = () => ({
  sendMail: jest.fn().mockReturnValue('test'),
});

// redis service 에서 사용될 목 함수
const mockRedisService = () => ({
  setex: jest.fn().mockReturnValue('test'),
  get: jest.fn().mockReturnValue('test'),
  getClient: jest.fn().mockReturnValue('getClient'),
});

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let userRepository: MockUserRepository;
  let adminRepository: MockAdminUserRepository;
  let mailerService: MailerService;
  let redisService: RedisService;
  let redisClient: Redis;

  beforeEach(async () => {
    // 가짜 모듈을 만들어 줌.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
        {
          provide: getRepositoryToken(AdminUser),
          useClass: MockAdminUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
        {
          provide: MailerService,
          useValue: mockMailerService(),
        },
        {
          provide: RedisService,
          useValue: mockRedisService(),
        },
      ],
    }).compile();

    // 가짜 모듈을 만든 것을 서비스에 삽입.
    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    adminRepository = module.get(getRepositoryToken(AdminUser));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    mailerService = module.get<MailerService>(MailerService);
    redisService = module.get<RedisService>(RedisService);
    redisClient = redisService.getClient();
  });

  describe('checkEffective 유저 회원가입 시 유효성 검사', () => {
    const test1 = {
      email: 'lololo@navercom',
      password: '12345',
      authentNum: '12345',
    };
    const test2 = {
      email: 'lololo@naver.com',
      password: '12345',
      authentNum: '1234',
    };
    it('이메일 형식이 올바르지 않은 경우', async () => {
      try {
        await service.checkEffective(test1);
      } catch (err) {
        console.log('에러 발생~~~~');
        expect(err.name).toBe('WrongEmailError');
        expect(err.message).toBe('이메일 형식이 올바르지 않습니다.');
      }
    });

    it.todo('비밀번호, 비밀번호 확인 둘이 일치하지 않는 경우.');
    it.todo('패스워드가 너무 짧은 경우');
    it.todo('유효성에 문제가 없어서 아무런 에러도 반환하지 않는 경우');
  });

  describe('checkEffectiveForAdmin 관리자 회원가입 시 유효성 검사', () => {
    it.todo('이메일 형식이 올바르지 않은 경우');
    it.todo('패스워드가 짧은 경우');
    it.todo('올바른 전화번호가 아닐 경우');
    it.todo('유효성에 문제가 없어서 아무런 에러도 반환하지 않는 경우');
  });

  describe('checkingAccount 유저 회원가입 시 이메일 중복 검사', () => {
    it.todo('이미 존재하는 이메일이어서 에러를 반환하는 경우');
    it.todo('중복성 검사를 통과하여 아무런 에러도 반환하지 않는 경우');
  });

  describe('checkingAdminAccount 관리자 회원가입 시 이메일 중복 검사', () => {
    it.todo('이미 존재하는 이메일이어서 에러를 반환하는 경우');
    it.todo('중복성 검사를 통과하여 아무런 에러도 반환하지 않는 경우');
  });
});
