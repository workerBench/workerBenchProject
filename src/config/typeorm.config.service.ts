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
      port: parseInt(this.configService.get('DB_PORT'), 10),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database:
        this.configService.get('NODE_ENV') === 'test'
          ? this.configService.get('TEST_DB_NAME')
          : this.configService.get('DB_NAME'),
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
      synchronize: this.configService.get('DB_SYNCHRONAIZE') === 'true',
      logging: this.configService.get('DB_LOGGING') === 'true', // sql 문 logging
      keepConnectionAlive: true, // false 일 시 서버를 재시작 하면 DB disconnect
      charset: 'utf8mb4', // 나중에 이모티콘도 추가하려 할 시 필요.
    };
  }
}
