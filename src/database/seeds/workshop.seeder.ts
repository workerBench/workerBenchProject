import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { WorkShop } from '../../entities/workshop';
import { ftruncateSync } from 'fs';

export default class WorkshopSeeder implements Seeder {
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
        user_id: 1,
        genre_id: 1,
      },
    ]);
  }
}
