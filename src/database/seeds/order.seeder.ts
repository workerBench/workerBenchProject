import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { WorkShop } from '../../entities/workshop';
import { Order } from '../../entities/order';

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

    const orderRepository = await dataSource.getRepository(Order);

    await orderRepository.insert([
      {
        imp_uid: '1643289-4284937',
        amount: 39800,
        pay_method: 'card',
        status: 'paid',
        user_id: 1,
        workshop_id: 1,
      },
    ]);
  }
}
