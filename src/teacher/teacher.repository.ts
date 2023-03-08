import { Injectable } from "@nestjs/common";
import { Company } from "src/entities/company";
import { Teacher } from "src/entities/teacher";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CompanyRepository extends Repository<Company> {
  constructor(private dataSource: DataSource) {
    super(Teacher, dataSource.createEntityManager());
  }

  async getArticlesByViewCount() {
    const result = await this.createQueryBuilder('company')
    .leftJoinAndSelect("workerbench.teacher", "teacher") 
    .getMany();
    return result;
  }
}