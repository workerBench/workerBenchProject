import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AdminUser } from 'src/entities/admin-user';
import { Company } from 'src/entities/company';
import { CompanyApplication } from 'src/entities/company-application';
import { GenreTag } from 'src/entities/genre-tag';
import { Order } from 'src/entities/order';
import { PurposeTag } from 'src/entities/purpose-tag';
import { Review } from 'src/entities/review';
import { ReviewImage } from 'src/entities/review-image';
import { Teacher } from 'src/entities/teacher';
import { WishList } from 'src/entities/wish-list';
import { WorkShop } from 'src/entities/workshop';
import { WorkShopImage } from 'src/entities/workshop-image';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';
import { WorkShopPurpose } from 'src/entities/workshop-purpose';
import { User } from 'src/entities/user';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: [
        AdminUser,
        CompanyApplication,
        Company,
        GenreTag,
        Order,
        PurposeTag,
        ReviewImage,
        Review,
        Teacher,
        User,
        WishList,
        WorkShopImage,
        WorkShopInstanceDetail,
        WorkShopPurpose,
        WorkShop,
      ],
      synchronize: false,
      logging: true, // sql 문 띄워줌
      keepConnectionAlive: true, // 이거 안 켜두면 서버 재시작할 때 DB 연결을 끊어버려.
      charset: 'utf8mb4', // 나중에 이모티콘도 추가할려고
    };
  }
}
