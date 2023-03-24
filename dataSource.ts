import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { WorkShop } from './src/entities/workshop';
import { CompanyApplication } from './src/entities/company-application';
import { Company } from './src/entities/company';
import { GenreTag } from './src/entities/genre-tag';
import { Order } from './src/entities/order';
import { PurposeTag } from './src/entities/purpose-tag';
import { ReviewImage } from './src/entities/review-image';
import { Review } from './src/entities/review';
import { Teacher } from './src/entities/teacher';
import { User } from './src/entities/user';
import { WishList } from './src/entities/wish-list';
import { WorkShopImage } from './src/entities/workshop-image';
import { WorkShopInstanceDetail } from './src/entities/workshop-instance.detail';
import { WorkShopPurpose } from './src/entities/workshop-purpose';
import { AdminUser } from './src/entities/admin-user';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DB_NAME
      : process.env.DB_NAME,
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
  migrations: [__dirname + '/src/migrations/*.ts'],
  charset: 'utf8mb4_general_ci',
  synchronize: true,
  // logging: true,
});

export default dataSource;
