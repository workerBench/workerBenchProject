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

import * as bcrypt from 'bcrypt';

const mockJwt = '31k4hjk3';

interface ImockUserTable {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null | Date;
  user_type: number;
  isBan: number;
}

const mockUserId = 1;
const mockUserTable: ImockUserTable[] = [
  {
    id: mockUserId,
    email: 'lololo@naver.com',
    password: bcrypt.hashSync('12345', 12),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    user_type: 0,
    isBan: 0,
  },
];

interface ImockAdminTable {
  id: number;
  email: string;
  password: string;
  name: string;
  phone_number: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null | Date;
  admin_type: number;
}

const mockAdminId = 1;
const mockAdminTable: ImockAdminTable[] = [
  {
    id: mockAdminId,
    email: 'lololo@naver.com',
    password: bcrypt.hashSync('12345', 12),
    name: '김바보',
    phone_number: '01022224444',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    admin_type: 0,
  },
];

const mockRedisDB = {};

const userTestEmail = 'usertest@naver.com';
const adminTestEmail = 'admintest@naver.com';

// User repository 에서 사용될 목 함수
class MockUserRepository {
  async findOne(param: {
    where: { email: string };
    select?:
      | [id: string, email: string, password: string, user_type: string]
      | [id: string, email: string, user_type: string, isBan: string];
  }) {
    let result: ImockUserTable | boolean | object = false;
    mockUserTable.forEach((user) => {
      if (user.email === param.where.email && !param.select) {
        result = user;
      }
      if (
        user.email === param.where.email &&
        param.select &&
        param.select[3] !== 'isBan'
      ) {
        result = {
          id: user.id,
          email: user.email,
          password: user.password,
          user_type: user.user_type,
        };
      }
      if (
        user.email === param.where.email &&
        param.select &&
        param.select[3] === 'isBan'
      ) {
        result = {
          id: user.id,
          email: user.email,
          user_type: user.user_type,
          isBan: user.isBan,
        };
      }
    });
    return result;
  }

  async save(param: { email: string; password: string }) {
    mockUserTable.push({
      id: mockUserTable.length + 1,
      email: param.email,
      password: param.password,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      user_type: 0,
      isBan: 0,
    });
    return mockUserTable[mockUserTable.length - 1];
  }
}

// Admin repository 에서 사용될 목 함수
class MockAdminUserRepository {
  async findOne(param: {
    where: { email: string };
    select?:
      | [id: 'id', email: 'email', admin_type: 'admin_type']
      | [
          id: 'id',
          email: 'email',
          password: 'password',
          admin_type: 'admin_type',
        ];
  }) {
    let result: ImockAdminTable | boolean | object = false;
    mockAdminTable.forEach((user) => {
      if (user.email === param.where.email && !param.select) {
        result = user;
      }
      if (
        user.email === param.where.email &&
        param.select &&
        param.select[2] !== 'password'
      ) {
        result = {
          id: user.id,
          email: user.email,
          admin_type: user.admin_type,
        };
      }
      if (
        user.email === param.where.email &&
        param.select &&
        param.select[2] === 'password'
      ) {
        result = {
          id: user.id,
          email: user.email,
          password: user.password,
          admin_type: user.admin_type,
        };
      }
    });
    return result;
  }

  async save(param: {
    email: string;
    password: string;
    name: string;
    phone_number: string;
  }) {
    mockAdminTable.push({
      id: mockAdminTable.length + 1,
      email: param.email,
      password: param.password,
      name: param.name,
      phone_number: param.phone_number,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      admin_type: 0,
    });
    return mockAdminTable[mockAdminTable.length - 1];
  }
}

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
  sendMail: jest.fn(({ to, from, subject, html }) => {
    return;
  }),
});

// redis service 에서 사용될 목 함수
const mockRedisService = () => ({
  //   (key: string | number, time: number, value: string | number | boolean) => {
  //     mockRedisDB[key] = value;
  //   },
  // ),
  // get: jest.fn((key: string | number) => {
  //   if (mockRedisDB[key]) {
  //     return mockRedisDB[key];
  //   }
  //   return null;
  // }),
  getClient: jest.fn().mockReturnValue(new RedisClass()),
});

class RedisClass {
  async setex(
    key: string | number,
    time: number,
    value: string | number | boolean,
  ) {
    mockRedisDB[key] = value;
  }

  async get(key: string | number) {
    if (mockRedisDB[key]) {
      return mockRedisDB[key];
    }
    return null;
  }
}

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
    const test3 = {
      email: 'lololo@naver.com',
      password: '12',
      authentNum: '12',
    };
    const test4 = {
      email: 'lololo@naver.com',
      password: '12345',
      authentNum: '12345',
    };
    it('이메일 형식이 올바르지 않은 경우', async () => {
      try {
        await service.checkEffective(test1);
      } catch (err) {
        expect(err.name).toBe('WrongEmailError');
        expect(err.message).toBe('이메일 형식이 올바르지 않습니다.');
      }
    });

    it('비밀번호, 비밀번호 확인 둘이 일치하지 않는 경우.', async () => {
      try {
        await service.checkEffective(test2);
      } catch (err) {
        expect(err.name).toBe('WrongPasswordError');
        expect(err.message).toBe('패스워드가 일치하지 않습니다.');
      }
    });

    it('패스워드가 너무 짧은 경우', async () => {
      try {
        await service.checkEffective(test3);
      } catch (err) {
        expect(err.name).toBe('WrongPasswordError');
        expect(err.message).toBe('패스워드가 짧습니다.');
      }
    });

    it('유효성에 문제가 없어서 아무런 에러도 반환하지 않는 경우', async () => {
      await expect(service.checkEffective(test4)).resolves.toBeUndefined();
    });
  });

  describe('checkEffectiveForAdmin 관리자 회원가입 시 유효성 검사', () => {
    const admin1 = {
      email: 'lololo@navercom',
      password: '12345',
      name: '김바보',
      phone_number: '01022223333',
    };
    const admin2 = {
      email: 'lololo@naver.com',
      password: '1234',
      name: '김바보',
      phone_number: '01022223333',
    };
    const admin3 = {
      email: 'lololo@naver.com',
      password: '12345',
      name: '김바보',
      phone_number: '0102222333',
    };
    const admin4 = {
      email: 'lololo@naver.com',
      password: '12345',
      name: '김바보',
      phone_number: '01022223333',
    };
    it('이메일 형식이 올바르지 않은 경우', async () => {
      try {
        await service.checkEffectiveForAdmin(admin1);
      } catch (err) {
        expect(err.name).toBe('WrongEmailError');
        expect(err.message).toBe('이메일 형식이 올바르지 않습니다.');
      }
    });
    it('패스워드가 짧은 경우', async () => {
      try {
        await service.checkEffectiveForAdmin(admin2);
      } catch (err) {
        expect(err.name).toBe('WrongPasswordError');
        expect(err.message).toBe('패스워드가 짧습니다.');
      }
    });
    it('올바른 전화번호가 아닐 경우', async () => {
      try {
        await service.checkEffectiveForAdmin(admin3);
      } catch (err) {
        expect(err.name).toBe('WrongPhoneNumberError');
        expect(err.message).toBe('올바른 전화번호가 아닙니다.');
      }
    });
    it('유효성에 문제가 없어서 아무런 에러도 반환하지 않는 경우', async () => {
      expect(await service.checkEffectiveForAdmin(admin4)).toBeUndefined();
    });
  });

  describe('checkingAccount 유저 회원가입 시 이메일 중복 검사', () => {
    const email1 = 'lolo@naver.com';
    const email2 = 'lololo@naver.com';

    it('이미 존재하는 이메일이어서 에러를 반환하는 경우', async () => {
      expect(userRepository.findOne).toBeDefined();

      try {
        await service.checkingAccount(email2);
      } catch (err) {
        expect(err.name).toBe('DuplicationEmailError');
        expect(err.message).toBe('이미 존재하는 이메일 입니다.');
      }
    });

    it('중복성 검사를 통과하여 아무런 에러도 반환하지 않는 경우', async () => {
      expect(userRepository.findOne).toBeDefined();
      expect(await service.checkingAccount(email1)).toBeUndefined();
    });
  });

  describe('checkingAdminAccount 관리자 회원가입 시 이메일 중복 검사', () => {
    const email1 = 'lolo@naver.com';
    const email2 = 'lololo@naver.com';

    it('이미 존재하는 이메일이어서 에러를 반환하는 경우', async () => {
      expect(adminRepository.findOne).toBeDefined();

      try {
        await service.checkingAccount(email2);
      } catch (err) {
        expect(err.name).toBe('DuplicationEmailError');
        expect(err.message).toBe('이미 존재하는 이메일 입니다.');
      }
    });
    it('중복성 검사를 통과하여 아무런 에러도 반환하지 않는 경우', async () => {
      expect(adminRepository.findOne).toBeDefined();
      expect(await service.checkingAccount(email1)).toBeUndefined();
    });
  });

  describe('sendingEmailAuthCode, checkingEmailCode 유저 회원가입 시 이메일 인증 코드 발송 및 검사', () => {
    it.todo('인증코드를 생성하여 redis 에 저장한 후 이메일 발송');
    it.todo('이메일 인증코드 검사');
  });

  describe('joinUser, joinAdminUser 회원가입 시 실제로 DB 에 insert', () => {
    it('새로운 유저를 생성 후 생성된 레코드를 반환', async () => {
      expect(await service.joinUser(userTestEmail, '12345')).toMatchObject({
        id: mockUserTable.length,
        email: userTestEmail,
        password: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        deletedAt: null,
        user_type: 0,
        isBan: 0,
      });
    });
    it('새로운 관리자를 생성 후 생성된 레코드를 반환', async () => {
      const parmas = {
        email: adminTestEmail,
        password: '12345',
        name: '바보바보',
        phone_number: '01033332222',
      };
      expect(await service.joinAdminUser(parmas)).toMatchObject({
        id: mockAdminTable.length,
        email: adminTestEmail,
        password: expect.anything(),
        name: '바보바보',
        phone_number: '01033332222',
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        deletedAt: null,
        admin_type: 0,
      });
    });
  });

  describe('유저, 관리자 access token 발행', () => {
    it('유저 access token 이 promise 로 잘 리턴되는지만 확인', async () => {
      expect(
        await service.makeAccessToken(1, 'lololo@naver.com', 0),
      ).toBeDefined();
      expect(
        await service.makeAccessTokenForAdmin(1, 'lololo@naver.com', 0),
      ).toBeDefined();
    });
  });

  describe('유저, 관리자 refresh token 발행', () => {
    it('makeRefreshToken, makeRefreshTokenForAdmin refresh 토큰 발행', async () => {
      expect(
        await service.makeRefreshToken(1, 'lololo@naver.com', 0, '127.0.0.1'),
      ).toBeDefined();
      expect(
        await service.makeRefreshTokenForAdmin(
          1,
          'lololo@naver.com',
          0,
          '127.0.0.1',
        ),
      ).toBeDefined();
    });
  });

  describe('유저 / 강사 or 관리자 로그인 시 계정 정보 DB에서 확인', () => {
    it('checkLoginUser 유저 / 강사 db 조회 - 찾지 못한 경우', async () => {
      try {
        await service.checkLoginUser('asjdjsakl@dasiad.com', '12345');
      } catch (err) {
        expect(err.name).toBe('DoesntExistEmailOrPasswordError');
        expect(err.message).toBe('이메일 또는 비밀번호가 일치하지 않습니다');
      }

      try {
        await service.checkLoginUser(userTestEmail, '1234');
      } catch (err) {
        expect(err.name).toBe('DoesntExistEmailOrPasswordError');
        expect(err.message).toBe('이메일 또는 비밀번호가 일치하지 않습니다');
      }
    });
    it('checkLoginUser 유저 / 강사 db 조회 - 찾은 경우', async () => {
      expect(
        await service.checkLoginUser(userTestEmail, '12345'),
      ).toBeDefined();
    });

    it('checkLoginAdminUser 관리자 db 조회 - 찾지 못한 경우', async () => {
      try {
        await service.checkLoginAdminUser('djklj@jfljsl.com', '12345');
      } catch (err) {
        expect(err.name).toBe('DoesntExistEmailOrPasswordError');
        expect(err.message).toBe('이메일 또는 비밀번호가 일치하지 않습니다');
      }
      try {
        await service.checkLoginAdminUser(adminTestEmail, '1234');
      } catch (err) {
        expect(err.name).toBe('DoesntExistEmailOrPasswordError');
        expect(err.message).toBe('이메일 또는 비밀번호가 일치하지 않습니다');
      }
    });

    it('checkLoginAdminUser 관리자 db 조회 - 찾은 경우', async () => {
      expect(
        await service.checkLoginAdminUser(adminTestEmail, '12345'),
      ).toBeDefined();
    });
  });
});
