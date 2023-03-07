import { Injectable } from '@nestjs/common';
import { WorkShop } from 'src/entities/workshop';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WorkshopRepository extends Repository<WorkShop> {
  constructor(private dataSource: DataSource) {
    super(WorkShop, dataSource.createEntityManager());
  }

  async getWorkshopsByOrder() {
    const result = await this.createQueryBuilder('workshop')
      .innerJoinAndSelect('workshop.Orders', 'order')
      .getMany();

    return result;
  }
}
