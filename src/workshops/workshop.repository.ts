import { Injectable } from '@nestjs/common';
import { GenreTag } from 'src/entities/genre-tag';
import { PurposeTag } from 'src/entities/purpose-tag';
import { WorkShop } from 'src/entities/workshop';
import { WorkShopPurpose } from 'src/entities/workshop-purpose';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WorkshopRepository extends Repository<WorkShop> {
  connection: any;
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

  async getWorkshopsByOrder() {
    const result = await this.dataSource.query(
      'SELECT w.id, title, category, `DESC`, thumb, min_member, max_member, total_time, price, count(o.workshop_id) AS orderCount FROM `WORKSHOP` w INNER JOIN `ORDER` o ON w.id = o.workshop_id WHERE w.deletedAt IS NULL GROUP BY w.id ORDER BY orderCount desc LIMIT 8',
    );
    return result;
  }

  /*querybuilder로 사용할 때
    async getWorkshopsByOrder() {
    const result = await this.createQueryBuilder('workshop')
      .select('COUNT(o.workshop_id)', 'count')
      .addSelect('w.id')
      .addSelect('w.title')
      .addSelect('w.category')
      .addSelect('w.desc', 'DESC')
      .addSelect('w.thumb')
      .addSelect('w.min_member')
      .addSelect('w.max_member')
      .addSelect('w.total_time')
      .addSelect('w.price')
      .from(WorkShop, 'w')
      .innerJoin(Order, 'o', 'w.id = o.workshop_id')
      .groupBy('w.id')
      .orderBy('count', 'DESC')
      .limit(8)
      .getRawMany();

    return result;
  }*/

  /* ---------------------- 워크샵 검색 API ---------------------- */

  /*'SELECT w.id, title, category, thumb, min_member, max_member, total_time, price, location, 
  w.deletedAt, g.name, p.name FROM workshop w INNER JOIN genre_tag g INNER JOIN purpose_tag p'*/

  // async searchWorkshops(category: string, location: string, purpose: string) {
  //   let query = await this.dataSource.query(
  //     'SELECT w.id, title, category, thumb, min_member, max_member, total_time, price, location, w.deletedAt, g.name, p.name FROM workshop w INNER JOIN genre_tag g INNER JOIN purpose_tag p',
  //   );

  async searchWorkshops(category: string, location: string, genre: string) {
    const queryBuilder = this.createQueryBuilder('workshop')
      .innerJoinAndSelect('workshop.GenreTag', 'genre_tag')
      .select([
        'workshop.title',
        'workshop.category',
        'workshop.location',
        'genre_tag.name',
      ]);
    // .innerJoinAndSelect(WorkShopPurpose, 'workshop_Purpose')
    // .innerJoinAndSelect(PurposeTag, 'purpose');

    // workshop은 purpose를 바로 참조하지 않고 workshop_purpose 테이블을 통해 연결됨

    if (genre) {
      queryBuilder.where('genre_tag.name = :genre', {
        genre: `${genre}`,
      });
    }

    if (category) {
      queryBuilder.andWhere('workshop.category = :category', {
        category: `${category}`,
      });
    }

    if (location) {
      queryBuilder.andWhere('workshop.location = :location', {
        location: `${location}`,
      });
    }

    const workshops = await queryBuilder.getRawMany();
    return workshops;
  }
}
