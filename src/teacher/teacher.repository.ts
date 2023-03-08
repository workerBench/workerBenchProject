import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/entities/company";
import { Teacher } from "src/entities/teacher";
import { DataSource, Repository } from "typeorm";

// @Injectable()
// export class CompanyRepository extends Repository<Company> {
//   constructor(private dataSource: DataSource) {
//     super(Teacher, dataSource.createEntityManager());
//   }

//   async getTeacherMypageQuery() {
//     const result = await this.createQueryBuilder('company')
//     .leftJoinAndSelect("company.user", "user") 
//     .select([
//       'company.id',
//       'company.company_type',
//       'company.company_name',
//       'company.business_number',
//       'company.rrn_front',
//       'company.rrn_back',
//       'company.bank_name',
//       'company.account',
//       'company.saving_name',
//       'user.phone_number',
//       'user.address',
//       'user.name',
//     ])
//     .getMany();
//     return result;
//   }
// }
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findAll(): Promise<Company[]> {
    return this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.user', 'user')
      .select([
        'company.id',
        'company.company_type',
        'company.company_name',
        'company.business_number',
        'company.rrn_front',
        'company.rrn_back',
        'company.bank_name',
        'company.account',
        'company.saving_name',
        'user.phone_number',
        'user.address',
        'user.name',
      ])
      .getMany();
  }
}