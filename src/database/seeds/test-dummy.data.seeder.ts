import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { AdminUser } from '../../entities/admin-user';
import { CompanyApplication } from '../../entities/company-application';
import { Company } from '../../entities/company';
import { GenreTag } from '../../entities/genre-tag';
import { Order } from '../../entities/order';
import { PurposeTag } from '../../entities/purpose-tag';
import { ReviewImage } from '../../entities/review-image';
import { Review } from '../../entities/review';
import { Teacher } from '../../entities/teacher';
import { User } from '../../entities/user';
import { WishList } from '../../entities/wish-list';
import { WorkShopImage } from '../../entities/workshop-image';
import { WorkShopInstanceDetail } from '../../entities/workshop-instance.detail';
import { WorkShop } from '../../entities/workshop';
import { WorkShopPurpose } from '../../entities/workshop-purpose';

import * as bcrypt from 'bcrypt';

export default class TestSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // 1. factory를 사용할 경우 (랜덤 데이터)
    // const workShopFactory = await factoryManager.get(WorkShop);
    // await workShopFactory.saveMany(10);

    // 2. dummy data를 하드코딩할 경우
    // 랜덤 날짜 구하는 함수

    const userPs1 = await bcrypt.hash('12345', 12);
    const userPs2 = await bcrypt.hash('12345', 12);
    const userPs3 = await bcrypt.hash('12345', 12);
    const userPs4 = await bcrypt.hash('12345', 12);
    const userPs5 = await bcrypt.hash('12345', 12);
    const userPs6 = await bcrypt.hash('12345', 12);
    const userPs7 = await bcrypt.hash('12345', 12);
    const userPs8 = await bcrypt.hash('12345', 12);
    const userPs9 = await bcrypt.hash('12345', 12);
    const userPs10 = await bcrypt.hash('12345', 12);
    const userPs11 = await bcrypt.hash('12345', 12);
    const userPs12 = await bcrypt.hash('12345', 12);
    const userPs13 = await bcrypt.hash('12345', 12);

    const adminPs1 = await bcrypt.hash('12345', 12);
    const adminPs2 = await bcrypt.hash('12345', 12);
    const adminPs3 = await bcrypt.hash('12345', 12);

    const adminUserRepository = dataSource.getRepository(AdminUser);
    const companyApplicationRepository =
      dataSource.getRepository(CompanyApplication);
    const companyRepository = dataSource.getRepository(Company);
    const genreTagRepository = dataSource.getRepository(GenreTag);
    const orderRepository = dataSource.getRepository(Order);

    const purposeTagRepository = dataSource.getRepository(PurposeTag);
    const reviewImageRepository = dataSource.getRepository(ReviewImage);
    const reviewRepository = dataSource.getRepository(Review);
    const teacherRepository = dataSource.getRepository(Teacher);
    const userRepository = dataSource.getRepository(User);

    const wishListRepository = dataSource.getRepository(WishList);
    const workshopImageRepository = dataSource.getRepository(WorkShopImage);
    const workshopInstanceDetailRepository = dataSource.getRepository(
      WorkShopInstanceDetail,
    );
    const workshopPurposeRepository = dataSource.getRepository(WorkShopPurpose);
    const workshopRepository = dataSource.getRepository(WorkShop);

    await adminUserRepository.insert([
      {
        email: 'admin1@test.com',
        password: adminPs1,
        name: '테스트1 관리자',
        phone_number: '01022224444',
        admin_type: 0,
      },
      {
        email: 'admin2@test.com',
        password: adminPs2,
        name: '테스트2 관리자',
        phone_number: '01022224444',
        admin_type: 0,
      },
      {
        email: 'admin3@test.com',
        password: adminPs3,
        name: '테스트3 관리자',
        phone_number: '01022224444',
        admin_type: 1,
      },
    ]);

    await userRepository.insert([
      {
        email: 'user1@test.com',
        password: userPs1,
        user_type: 1,
        isBan: 0,
      },
      {
        email: 'user2@test.com',
        password: userPs2,
        user_type: 1,
        isBan: 0,
      },
      {
        email: 'user3@test.com',
        password: userPs3,
        user_type: 1,
        isBan: 0,
      },
      {
        email: 'user4@test.com',
        password: userPs4,
        user_type: 1,
        isBan: 0,
      },
    ]);

    await genreTagRepository.insert([
      {
        name: '문화예술',
      },
      {
        name: '식음',
      },
      {
        name: '심리진단',
      },
      {
        name: '운동',
      },
    ]);

    await purposeTagRepository.insert([
      {
        name: '동기부여',
      },
      {
        name: '팀워크',
      },
      {
        name: '회식',
      },
      {
        name: '힐링',
      },
    ]);

    await teacherRepository.insert([
      {
        user_id: 1,
        phone_number: '01033334444',
        address: '서울시 여러분 안녕',
        name: '강사 1',
        affiliation_company_id: 0,
      },
      {
        user_id: 2,
        phone_number: '01033335555',
        address: '부산시 여러분 안녕',
        name: '강사 2',
        affiliation_company_id: 0,
      },
      {
        user_id: 3,
        phone_number: '01033335555',
        address: '대구시 여러분 안녕',
        name: '강사 3',
        affiliation_company_id: 0,
      },
      {
        user_id: 4,
        phone_number: '01033335555',
        address: '대전시 여러분 안녕',
        name: '강사 4',
        affiliation_company_id: 0,
      },
    ]);

    await companyRepository.insert([
      {
        company_type: 0,
        company_name: '가나다 회사',
        business_number: 12345,
        bank_name: '신한은행',
        account: 12345,
        saving_name: '김바보',
        user_id: 4,
      },
    ]);
  }
}
