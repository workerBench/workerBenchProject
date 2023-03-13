import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/auth/register  유저 회원가입 시도 시 유효성 검사', () => {
    it('/api/auth/register (Post)', async () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'lokifamily@naver.com',
          password: '12345',
          authentNum: '12345',
        })
        .expect(201);
    });

    it('/api/auth/register/join (Post) 이메일 인증 코드를 입력하지 못하므로 실패.', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register/join')
        .send({
          email: 'lokifamily@naver.com',
          password: '12345',
          emailAuthCode: '',
        })
        .expect(400);
    });
  });

  // describe('/api/auth/login (Post)  유저 / 강사 로그인', () => {
  //   it('/api/auth/login (Post) 유저 / 강사 로그인 성공 케이스', () => {
  //     return request(app.getHttpServer())
  //       .post('/api/auth/login')
  //       .send({
  //         email: 'user1@test.com',
  //         password: '12345',
  //       })
  //       .expect(201);
  //   });
  // });

  // describe('/api/auth/refreshtoken/user (Get) 유저 or 강사의 access token 에 문제가 있을 시 refresh token 검증 요청', () => {
  //   it('/api/auth/refreshtoken/user (Get)', () => {
  //     return request(app.getHttpServer())
  //       .get('/api/auth/refreshtoken/user')
  //       .expect(401);
  //   });
  // });
});
