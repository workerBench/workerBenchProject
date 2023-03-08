import { Injectable } from '@nestjs/common';
import { WorkShop } from 'src/entities/workshop';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WorkshopRepository extends Repository<WorkShop> {
  constructor(private dataSource: DataSource) {
    super(WorkShop, dataSource.createEntityManager());
  }

  // 인기 워크샵 조회

  /*SQL RAW QUERY
  SELECT w.id, title, category, `DESC`, thumb, min_member, max_member, total_time, price, count(o.workshop_id) AS orderCount
  FROM `WORKSHOP` w INNER JOIN `ORDER` o ON w.id = o.workshop_id
  WHERE w.deletedAt IS NULL
  GROUP BY w.id
  ORDER BY orderCount desc
  LIMIT 8*/

  // async getWorkshopsByOrder() {
  //   const result = await this.createQueryBuilder('workshop')
  //     .select('COUNT(o.workshop_id)', 'count')
  //     .addSelect('w.id')
  //     .addSelect('w.title')
  //     .addSelect('w.category')
  //     .addSelect('w.desc', 'DESC')
  //     .addSelect('w.thumb')
  //     .addSelect('w.min_member')
  //     .addSelect('w.max_member')
  //     .addSelect('w.total_time')
  //     .addSelect('w.price')
  //     .from(WorkShop, 'w')
  //     .innerJoin(Order, 'o', 'w.id = o.workshop_id')
  //     .groupBy('w.id')
  //     .orderBy('count', 'DESC')
  //     .limit(8)
  //     .getRawMany();

  //   return result;
  // }

  async getWorkshopsByOrder() {
    const result = await this.dataSource.query(
      'SELECT w.id, title, category, `DESC`, thumb, min_member, max_member, total_time, price, count(o.workshop_id) AS orderCount FROM `WORKSHOP` w INNER JOIN `ORDER` o ON w.id = o.workshop_id WHERE w.deletedAt IS NULL GROUP BY w.id ORDER BY orderCount desc LIMIT 8',
    );
    return result;
  }
}
