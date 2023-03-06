import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company';
import { CompanyApplication } from './company-application';
import { User } from './user';

@Entity({ schema: 'workerbench', name: 'teacher' })
export class Teacher {
  @PrimaryColumn('int', { name: 'user_id' })
  user_id: number;

  @IsString({ message: '전화번호를 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '전화번호를 입력해 주세요' })
  @ApiProperty({
    example: '01022224444',
    description: '강사 전화번호. `-` 제외',
    required: true,
  })
  @Column('varchar', { name: 'phone_number', length: 50, nullable: false })
  phone_number: string;

  @IsString({ message: '주소를 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '주소를 입력해 주세요' })
  @ApiProperty({
    example: '서울시 종로구',
    description: '강사 실거주 주소',
    required: true,
  })
  @Column('varchar', { name: 'address', length: 100, nullable: false })
  address: string;

  @IsString({ message: '성함을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '성함을 입력해 주세요' })
  @ApiProperty({
    example: '김하하',
    description: '강사 실명',
    required: true,
  })
  @Column('varchar', { name: 'name', length: 30, nullable: false })
  name: string;

  @Column('int', { name: 'affiliation_company_id', nullable: true, default: 0 })
  affiliation_company_id: number | null;

  @Column('int', { name: 'possession_company_id', nullable: true, default: 0 })
  possession_company_id: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  /* ------------------------ 관계 mapping --------------------------- */

  // 1. user
  @OneToOne(() => User, (user) => user.TeacherProfile)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: User;

  // 2. company
  @OneToOne(() => Company, (company) => company.President)
  MyCompany: Company;

  // 3. company 2
  @ManyToOne(() => Company, (company) => company.EmployeeList, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'affiliation_company_id', referencedColumnName: 'id' }])
  AffiliationCompany: Company;

  // 4. company_application
  @OneToMany(
    () => CompanyApplication,
    (companyApplication) => companyApplication.Teacher,
  )
  ApplicationList: CompanyApplication[];
}
