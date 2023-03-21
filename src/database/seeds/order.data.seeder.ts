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

export default class OrderSeeder implements Seeder {
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

    await orderRepository.insert([
      {
        imp_uid: '2487-342nhjk',
        amount: 300000,
        pay_method: 'card',
        status: 'paid',
        user_id: 1,
        workshop_id: 3,
      },
      {
        imp_uid: '2487-342nhjk',
        amount: 300000,
        pay_method: 'card',
        status: 'paid',
        user_id: 1,
        workshop_id: 4,
      },
      {
        imp_uid: '2487-342nhjk',
        amount: 300000,
        pay_method: 'card',
        status: 'paid',
        user_id: 2,
        workshop_id: 3,
      },
      {
        imp_uid: '2487-342nhjk',
        amount: 300000,
        pay_method: 'card',
        status: 'paid',
        user_id: 2,
        workshop_id: 4,
      },
      {
        imp_uid: '2487-342nhjk',
        amount: 300000,
        pay_method: 'card',
        status: 'paid',
        user_id: 11,
        workshop_id: 3,
      },
      {
        imp_uid: '2487-342nhjk',
        amount: 300000,
        pay_method: 'card',
        status: 'paid',
        user_id: 11,
        workshop_id: 4,
      },
      {
        imp_uid: '2487-342nhjk',
        amount: 300000,
        pay_method: 'card',
        status: 'paid',
        user_id: 12,
        workshop_id: 3,
      },
      {
        imp_uid: '2487-342nhjk',
        amount: 300000,
        pay_method: 'card',
        status: 'paid',
        user_id: 12,
        workshop_id: 4,
      },
      {
        imp_uid: '2487-342nhjk',
        amount: 300000,
        pay_method: 'card',
        status: 'paid',
        user_id: 2,
        workshop_id: 10,
      },
      {
        imp_uid: '2487-342nhjk',
        amount: 300000,
        pay_method: 'card',
        status: 'paid',
        user_id: 2,
        workshop_id: 11,
      },
    ]);
  }
}
