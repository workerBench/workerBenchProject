import { RedisService } from '@liaoliaots/nestjs-redis';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { User } from 'src/entities/user';
import { DataSource, Repository } from 'typeorm';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  emailAuthCodeRedisKey,
  emailAuthCodeRedisKeyForResetPs,
  refreshTokenRedisKey,
  thisUserOnTheWayToChangePs,
} from './naming/redis-key-name';
import { adminTypeNaming, userTypeNaming } from './naming/user-type';
import { AdminUser } from 'src/entities/admin-user';
import { AdminRegisterJoinDto } from './dtos/admin-register-join';
import { ResetPassword } from './dtos/reset-password.dto';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { Teacher } from 'src/entities/teacher';
import { Company } from 'src/entities/company';

@Injectable()
export class AuthService {
  private readonly redisClient: Redis;

  private readonly s3Client: S3Client;
  public readonly S3_BUCKET_NAME: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
  ) {
    // redis 세팅
    this.redisClient = redisService.getClient();
    // S3 세팅
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
    });
    this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME');
  }

  // 유저 회원가입 시 유효성 검사
  async checkEffective(userInfo: RegisterAuthDto) {
    const { email, password, authentNum } = userInfo;

    if (!email || !email.includes('@') || !email.includes('.')) {
      throw new BadRequestException('이메일 형식이 올바르지 않습니다.');
    }
    if (password !== authentNum) {
      throw new BadRequestException('패스워드가 일치하지 않습니다.');
    }
    if (password.length < 4) {
      throw new BadRequestException('패스워드가 짧습니다.');
    }
  }

  // 관리자 회원가입 시 유효성 검사
  async checkEffectiveForAdmin(adminInfo: AdminRegisterJoinDto) {
    const { email, password, name, phone_number } = adminInfo;

    if (!email || !email.includes('@') || !email.includes('.')) {
      throw new BadRequestException('이메일 형식이 올바르지 않습니다.');
    }
    if (password.length < 4) {
      throw new BadRequestException('패스워드가 짧습니다.');
    }
    if (!name) {
      throw new BadRequestException('올바른 이름이 아닙니다.');
    }
    if (
      !phone_number ||
      phone_number.includes('-') ||
      phone_number.length !== 11
    ) {
      throw new BadRequestException('올바른 전화번호가 아닙니다.');
    }
    return;
  }

  // 유저 회원가입 시 이메일 중복 검사
  async checkingAccount(email: string) {
    console.log('111111');
    const check_email = await this.userRepository.findOne({ where: { email } });
    if (check_email) {
      throw new BadRequestException('이미 존재하는 이메일 입니다.');
    }
  }

  // 관리자 회원가입 시 이메일 중복 검사
  async checkingAdminAccount(email: string) {
    const check_email = await this.adminUserRepository.findOne({
      where: { email },
    });
    if (check_email) {
      throw new BadRequestException('이미 존재하는 이메일 입니다.');
    }
  }

  // 유저 회원가입 시 이메일 인증코드 발송
  async sendingEmailAuthCode(email: string) {
    console.log('2222222222');
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
        console.log('33333333333333333');
        console.log(error);
        throw new ConflictException();
      });
    return;
  }

  // 유저 회원가입 시 이메일 인증코드 검사
  async checkingEmailCode(email: string, emailAuthCode: string) {
    const authCodeOfRedis = await this.redisClient.get(
      emailAuthCodeRedisKey(email),
    );
    if (authCodeOfRedis !== emailAuthCode) {
      throw new BadRequestException('입력하신 인증번호가 적합하지 않습니다.');
    }
    return;
  }

  // 유저 회원가입 시 실제로 DB 에 insert
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

  // 관리자 회원가입 시 실제로 DB 에 insert
  async joinAdminUser(adminInfo: AdminRegisterJoinDto) {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(adminInfo.password, 12);
    // 회원가입
    const saveResult = await this.adminUserRepository.save({
      email: adminInfo.email,
      password: hashedPassword,
      name: adminInfo.name,
      phone_number: adminInfo.phone_number,
    });
    return saveResult;
  }

  // 유저 or 강사 access token 발행
  async makeAccessToken(id: number, email: string, userType: number) {
    const accessToekn = await this.jwtService.signAsync(
      { id, email, userType },
      {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: '600s',
        algorithm: 'HS256',
      },
    );
    return accessToekn;
  }

  // 관리자 access token 발행
  async makeAccessTokenForAdmin(id: number, email: string, adminType: number) {
    const accessToekn = await this.jwtService.signAsync(
      { id, email, adminType },
      {
        secret: this.configService.get('JWT_SECRET_KEY_ADMIN'),
        expiresIn: '600s',
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
        expiresIn: '3000s',
        algorithm: 'HS256',
      },
    );
    await this.redisClient.setex(
      refreshTokenRedisKey(userTypeString, id),
      3000,
      `${clientIp}_#_${refreshToekn}`,
    );
    return refreshToekn;
  }

  // 관리자 refresh token 발행
  async makeRefreshTokenForAdmin(
    id: number,
    email: string,
    adminType: number,
    clientIp: string,
  ) {
    let adminTypeString: string;
    if (adminType === 0) {
      adminTypeString = adminTypeNaming.normal;
    }
    if (adminType === 1) {
      adminTypeString = adminTypeNaming.super;
    }

    const refreshToekn = await this.jwtService.signAsync(
      { id, email, adminType },
      {
        secret: this.configService.get('JWT_SECRET_KEY_ADMIN'),
        expiresIn: '3000s',
        algorithm: 'HS256',
      },
    );

    await this.redisClient.setex(
      refreshTokenRedisKey(adminTypeString, id),
      3000,
      `${clientIp}_#_${refreshToekn}`,
    );
    return refreshToekn;
  }

  // 유저 or 강사 로그인 시 유저 정보 DB 체크
  async checkLoginUser(email: string, password: string) {
    const userInfo = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'user_type'],
    });
    if (!userInfo) {
      throw new BadRequestException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    if (!(await bcrypt.compare(password, userInfo.password))) {
      throw new BadRequestException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    return userInfo;
  }

  // 관리자 로그인 시 유저 정보 DB 체크
  async checkLoginAdminUser(email: string, password: string) {
    const adminInfo = await this.adminUserRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'admin_type'],
    });
    if (!adminInfo) {
      const err = new Error('이메일 또는 비밀번호가 일치하지 않습니다');
      err.name = 'DoesntExistEmailOrPasswordError';
      throw err;
    }
    if (!(await bcrypt.compare(password, adminInfo.password))) {
      const err = new Error('이메일 또는 비밀번호가 일치하지 않습니다');
      err.name = 'DoesntExistEmailOrPasswordError';
      throw err;
    }

    return adminInfo;
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

  // admin access token 에서 id 와 email 로 user 검사
  async checkAdminFromAdminAccessToken(
    id: number,
    email: string,
    adminType: number,
  ) {
    const adminInfo = await this.adminUserRepository.findOne({
      where: { id, email, admin_type: adminType },
      select: ['id', 'email', 'admin_type'],
    });

    return adminInfo;
  }

  // redis 의 user refresh token 검사
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
    ).split('_#_');

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

  // redis 의 admin refresh token 검사
  async checkAdminRefreshTokenInRedis(
    id: number,
    adminType: number,
    ip: string,
    refreshToken: string,
  ) {
    let adminTypeString: string;
    if (adminType === 0) {
      adminTypeString = adminTypeNaming.normal;
    }
    if (adminType === 1) {
      adminTypeString = adminTypeNaming.super;
    }

    const clientInfoFromRedis = (
      await this.redisClient.get(refreshTokenRedisKey(adminTypeString, id))
    ).split('_#_');

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

  // 부 관리자 삭제
  async removeAdmin(email: string) {
    // 부 관리자 계정이 존재하는지 체크
    const adminInfo = await this.adminUserRepository.findOne({
      where: { email },
    });

    if (!adminInfo) {
      const err = new Error('존재하지 않는 부관리자 계정입니다.');
      err.name = 'DoesntExistAdminAccount';
      throw err;
    }
    // soft delete
    await this.adminUserRepository.softDelete({ email });
    return;
  }

  // 비밀번호 재설정 시 이메일 검증
  async findByEmail(email: string) {
    // 이메일로 계정 찾기
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('존재하지 않는 계정입니다.');
    }
  }

  // 비밀번호 재설정 시도 시 이메일 인증 후 이메일로 인증코드 발송
  async sendingEmailResetCode(email: string) {
    const auth_num = randomBytes(3).toString('hex');
    await this.redisClient.setex(
      emailAuthCodeRedisKeyForResetPs(email),
      300,
      auth_num,
    ); // redis set

    this.mailerService
      .sendMail({
        to: email,
        from: this.configService.get('GOOGLE_MAIL'),
        subject: 'workshop 비밀번호 재설정 인증',
        html: `<h1>인증번호 : ${auth_num}</h1>`,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
        throw new ConflictException(
          '이메일에 인증코드를 발송하는 과정에서 문제가 발생하였습니다. 다시 시도해 주십시오.',
        );
      });
    return;
  }

  // 유저 비밀번호 재설정 시 이메일 인증코드 검사
  async checkingResetCode(email: string, emailAuthCode: string, ip: string) {
    const authCodeOfRedis = await this.redisClient.get(
      emailAuthCodeRedisKeyForResetPs(email),
    );
    if (!authCodeOfRedis) {
      throw new BadRequestException(
        '입력 제한시간이 지났습니다. 이메일 인증 재시도 부탁드립니다.',
      );
    }
    if (authCodeOfRedis !== emailAuthCode) {
      throw new BadRequestException('입력하신 인증번호가 적합하지 않습니다.');
    }

    // 해당 유저가 비밀번호를 바꾸는 절차를 진행중이다 라고 증거를 남김
    await this.redisClient.setex(
      thisUserOnTheWayToChangePs(email, ip),
      600,
      'true',
    );

    return;
  }

  async checkResetPsOnTheWay(email: string, ip: string) {
    const result = await this.redisClient.get(
      thisUserOnTheWayToChangePs(email, ip),
    );

    if (!result) {
      throw new BadRequestException(
        '이메일 인증 절차를 거치지 않은 상태이거나 이메일 인증 유효 기간이 만료되었습니다.',
      );
    }

    return;
  }

  async checkEffectiveForResetPs(info: ResetPassword) {
    const { password, authentNum } = info;
    if (password !== authentNum) {
      throw new BadRequestException('패스워드가 일치하지 않습니다.');
    }
    if (password.length < 4) {
      throw new BadRequestException('패스워드가 짧습니다.');
    }
  }

  async changePassword(email: string, password: string) {
    const newPassword = await bcrypt.hash(password, 12);
    await this.userRepository.update({ email }, { password: newPassword });
    return;
  }

  // user_id 로 teacher 테이블에서 강사 정보 찾기
  async getTeacherById(user_id: number) {
    const teacher = await this.teacherRepository.findOne({
      where: { user_id },
    });
    return teacher;
  }

  // user_id 로 teacher 가 업체를 직접 만들어 소유중인지 찾기
  async getTeachersCompany(user_id: number) {
    const company = await this.companyRepository.findOne({
      where: { user_id },
    });
    return company;
  }

  /* -------------------------------- 테스트용 API -------------------------------- */

  // 유저가 업로드한 사진을 S3 에 저장
  async uploadFileToS3(images: Array<Express.Multer.File>, workshopInfo: any) {
    // 썸네일 이미지 이름 만들기. 프론트에서는 썸네일을 가장 먼저 formData 에 저장하기에 무조건 배열의 첫 번째 사진이 썸네일.
    const thumbImgType = images[0].originalname.substring(
      images[0].originalname.lastIndexOf('.'),
      images[0].originalname.length,
    );
    const thumbImgName = uuid() + thumbImgType;

    /*
    여기서 워크샵을 insert 해야 함. 할 때 썸네일 경로, 이름과 같이 insert. insert 결과를 insertResult 변수에 저장.
    insert 한 후 insertResult.identifiers[0].id 로 id 를 가져와.
    가져와서 아래의 else 문 안에서 미리 바깥에서 만들어 둔 배열에 [img_name: "ddd", workshop_id: insertResult.identifiers[0].id]
    이런 식으로 push. 
    이렇게 만들어 진 배열을 workshop_image 에 insert 한다.
    */

    // 이제 썸네일 이미지와 서브 이미지들을 S3 에 저장해야 해.
    try {
      images.forEach(async (image, index) => {
        // 첫 번째 image 일 경우 해당 이미지는 썸네일 이미지로 간주한다.
        if (index === 0) {
          const s3OptionForThumbImg = {
            Bucket: 'workerbench', // S3의 버킷 이름.
            Key: `images/workshop/2/original/${thumbImgName}`, // 폴더 구조와 파일 이름 (실제로는 폴더 구조는 아님. 그냥 사용자가 인지하기 쉽게 폴더 혹은 주소마냥 나타내는 논리적 구조.)
            Body: image.buffer, // 업로드 하고자 하는 파일.
          };
          await this.s3Client.send(new PutObjectCommand(s3OptionForThumbImg)); // 실제로 S3 클라우드로 파일을 전송 및 업로드 하는 코드.
        } else {
          const subImgType = image.originalname.substring(
            image.originalname.lastIndexOf('.'),
            image.originalname.length,
          );
          const subImgName = uuid() + subImgType;
          const s3OptionForSubImg = {
            Bucket: 'workerbench',
            Key: `images/workshop/2/original/${subImgName}`,
            Body: image.buffer,
          };
          await this.s3Client.send(new PutObjectCommand(s3OptionForSubImg));
        }
      });
    } catch (err) {
      throw new HttpException('s3 이미지 업로드 도중 오류 발생', 400);
    }
  }

  // 워크샵 썸네일 가져오기. 이건... S3 버킷에 가서 파일 이름을 직접 복사해 와서 thumbName 변수에 넣어주셔야 합니다.
  async workshopThumbImg() {
    const workshop_id = 1;
    const region = this.configService.get('AWS_S3_REGION');
    const cloundFrontUrl = this.configService.get('AWS_CLOUD_FRONT_DOMAIN');
    const thumbName =
      'images/workshop/1/0dd9de79-2c49-4bb9-a462-c73b9f363e7b.jpeg';

    // const thumbUrl = `https://workerbench.s3.${region}.amazonaws.com/${thumbName}`;
    const thumbUrl = `${cloundFrontUrl}${thumbName}`;

    return thumbUrl;
  }

  // 동영상 저장
  async uploadVideoToS3(video: Express.Multer.File) {
    const review_id = 1; // 리뷰의 id 가 1 이라고 가정.

    // 랜덤한 이름 생성
    const videoTypeName = video.originalname.substring(
      video.originalname.lastIndexOf('.'),
      video.originalname.length,
    );
    const videoName = uuid() + videoTypeName;

    // s3 에 입력할 옵션
    const s3OptionForReviewVideo = {
      Bucket: this.S3_BUCKET_NAME,
      Key: `videos/review/1/${videoName}`,
      Body: video.buffer,
    };

    // 실제로 s3 버킷에 업로드
    await this.s3Client.send(new PutObjectCommand(s3OptionForReviewVideo));

    return;
  }

  // S3 에서 비디오 url 가져오기. 버킷에서 비디오의 제목을 가져와서 여기에 직접 입력해야 함.
  async getVideoUrl() {
    const review_id = 1;
    const region = this.configService.get('AWS_S3_REGION');
    const videoName =
      'videos/review/1/d2049ab0-1b35-4868-9b50-b37b62906eaf.mov';
    const videoUrl = `https://workerbench.s3.${region}.amazonaws.com/${videoName}`;
    return videoUrl;
  }

  // // 배열로 여러 개의 데이터를 한 번에 insert 가능한가 실험. 결과는 성공.
  // async userUptest() {
  //   const testResult: { email: string; password: string }[] = [
  //     { email: 'save1@test.com', password: '12345' },
  //     { email: 'save2@test.com', password: '12345' },
  //   ];

  //   await this.userRepository.insert(testResult);
  //   return;
  // }
}
