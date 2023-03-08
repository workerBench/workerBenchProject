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

export default class DongjuSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // 1. factory를 사용할 경우 (랜덤 데이터)
    // const workShopFactory = await factoryManager.get(WorkShop);
    // await workShopFactory.saveMany(10);
    // 2. dummy data를 하드코딩할 경우
    // 랜덤 날짜 구하는 함수
    const workShopRepository = await dataSource.getRepository(WorkShop);

    await workShopRepository.insert([
      {
        id: 1,
        title: 'test1',
        category: 'online',
        desc: '상세정보1',
        thumb: '이미지 링크',
        min_member: 5,
        max_member: 20,
        total_time: 120,
        price: 30000,
        status: 'request',
        location: '서울',
      },
    ]);
  }
}
