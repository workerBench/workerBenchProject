import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import expressBasicAuth from 'express-basic-auth';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import passport from 'passport';
import { HttpApiExceptionFilter } from './common/exceptions/http.api.exception.filter';
import cookieParser from 'cookie-parser';
import { join } from 'path';

class Application {
  private logger = new Logger(Application.name);
  private DEV_MODE: boolean;
  private PORT: string;
  private corsOriginList: string[];
  private ADMIN_USER: string;
  private ADMIN_PASSWORD: string;

  constructor(private server: NestExpressApplication) {
    this.server = server;

    // 초기 변수 설정
    if (!process.env.JWT_SECRET_KEY) this.logger.error('Set "SECRET" env');
    this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true;
    this.PORT = process.env.PORT || '5000';
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : ['*'];
    this.ADMIN_USER = process.env.ADMIN_USER || 'msdou';
    this.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12345';
  }

  // 스웨거 페이지 보안 세팅 함수. use 미들웨어 사용
  private setUpBasicAuth() {
    this.server.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: {
          [this.ADMIN_USER]: this.ADMIN_PASSWORD,
        },
      }),
    );
  }

  // 스웨거 api 페이지 생성. api middleware 생성
  private setUpOpenAPIMidleware() {
    SwaggerModule.setup(
      '/docs',
      this.server,
      SwaggerModule.createDocument(
        this.server,
        new DocumentBuilder()
          .setTitle('workerbench - API')
          .setDescription('TypeORM In Nest')
          .setVersion('0.0.1')
          .build(),
      ),
    );
  }

  // 미들웨어를 등록하는 함수
  private async setUpGlobalMiddleware() {
    this.server.enableCors({
      origin: this.corsOriginList,
      credentials: true,
    });
    this.server.use(cookieParser());
    this.setUpBasicAuth();
    this.setUpOpenAPIMidleware();
    this.server.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    this.server.use(passport.initialize());
    // this.server.use(passport.session());

    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)), // 엔티티에서 password 에 Exclude. 시리얼 라이즈가 있으면 Exclude 가 붙은 속성들은 제외시키고 클라이언트에게 데이터를 보내줘.
    );
    this.server.useGlobalFilters(new HttpApiExceptionFilter());

    // // this.server.setBaseViewsDir(join(__dirname, '..', '..', 'views'));
    // this.server.useStaticAssets(join(__dirname, '..', '..', 'public')); // 정적 파일 서빙
    // nunjucks.configure(join(__dirname, '..', '..', 'views'), {
    //   express: this.server,
    //   autoescape: true,
    // });
    // this.server.setViewEngine('njk'); // 해당 뷰 엔진을 사용한다.

    this.server.useStaticAssets(join(__dirname, '..', '..', 'public')); // 정적 파일 서빙
    this.server.setBaseViewsDir(join(__dirname, '..', '..', 'views')); // 엔진 위치. 즉 hbs파일 위치
    this.server.setViewEngine('ejs'); // 해당 뷰 엔진을 사용한다.
  }

  /*
  1. 글로벌 미들웨어 추가
  2. 서버를 실제로 가동하고, 포트를 연다.
  */
  async boostrap() {
    await this.setUpGlobalMiddleware();
    await this.server.listen(this.PORT);
  }

  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(`✅ Server on http://localhost:${this.PORT}`);
    } else {
      this.logger.log(`✅ Server on port ${this.PORT}...`);
    }
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new Application(server);
  await app.boostrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});
