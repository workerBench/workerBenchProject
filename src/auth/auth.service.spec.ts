import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdminUser } from 'src/entities/admin-user';
import { User } from 'src/entities/user';
import { AuthService } from './auth.service';

// User repository 에서 사용될 목 함수
class MockUserRepository {}

// Admin repository 에서 사용될 목 함수
class MockAdminUserRepository {}

describe('AuthService', () => {
  let service: AuthService;

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
      ],
    }).compile();

    // 가짜 모듈을 만든 것을 서비스에 삽입.
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkEffective 유저 회원가입 시 유효성 검사', () => {
    const test1 = {
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
