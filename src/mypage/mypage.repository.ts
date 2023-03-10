import { Injectable } from '@nestjs/common';
import { WorkShop } from 'src/entities/workshop';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MyPageRepository extends Repository<WorkShop> {
  constructor(private dataSource: DataSource) {
    super(WorkShop, dataSource.createEntityManager());
  }


  async getWorkshopsByOrder() {
    const result = await this.dataSource.query(
      'SELECT w.id, title, category, `DESC`, thumb, min_member, max_member, total_time, price, count(o.workshop_id) AS orderCount FROM `WORKSHOP` w INNER JOIN `ORDER` o ON w.id = o.workshop_id WHERE w.deletedAt IS NULL GROUP BY w.id ORDER BY orderCount desc LIMIT 8',
    );
    return result;
  }
}
