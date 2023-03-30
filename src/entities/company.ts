import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyApplication } from './company-application';
import { Teacher } from './teacher';

@Entity({ schema: 'workerbench', name: 'company' })
export class Company {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsNumber()
  @IsNotEmpty({ message: '업체 종류를 선택해 주세요' })
  @ApiProperty({
    example: 1,
    description: '업체 종류. 0=business, 1=freelancer',
    required: true,
  })
  @Column('int', {
    name: 'company_type',
    nullable: false,
  })
  company_type: number;

  @IsString({ message: '업체 이름을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '업체 이름을 입력해 주세요' })
  @ApiProperty({
    example: '가나다 업체',
    description: '업체 이름',
    required: true,
  })
  @Column('varchar', {
    name: 'company_name',
    length: 50,
    nullable: false,
  })
  company_name: string;

  @ApiProperty({
    example: '1638437489',
    description: '사업자 법인번호. `-` 없이 입력해 주세요',
    required: false,
  })
  @Column('bigint', { name: 'business_number', nullable: true })
  business_number: number | null;

  @IsNumber()
  @IsNotEmpty({ message: '주민번호 앞자리를 입력해 주세요' })
  @ApiProperty({
    example: '991203',
    description: '주민등록번호 앞자리',
    required: false,
  })
  @Column('int', { name: 'rrn_front', nullable: true })
  rrn_front: null | number;

  @IsNumber()
  @IsNotEmpty({ message: '주민번호 뒷자리를 입력해 주세요' })
  @ApiProperty({
    example: '1234567',
    description: '주민등록번호 뒷자리',
    required: false,
  })
  @Column('int', { name: 'rrn_back', nullable: true })
  rrn_back: number | null;

  @IsString({ message: '은행 이름을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '은행 이름을 입력해 주세요' })
  @ApiProperty({
    example: '신한은행',
    description: '은행 이름',
    required: true,
  })
  @Column('varchar', {
    name: 'bank_name',
    length: 20,
    nullable: false,
  })
  bank_name: string;

  @IsNumber()
  @ApiProperty({
    example: '110-22424-321879',
    description: '계좌 번호. `-` 없이 입력',
    required: true,
  })
  @Column('bigint', { name: 'account', nullable: false })
  account: number;

  @IsString({ message: '예금주 성함을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '예금주 성함을 입력해 주세요' })
  @ApiProperty({
    example: '김민수',
    description: '예금주 명',
    required: true,
  })
  @Column('varchar', {
    name: 'saving_name',
    length: 20,
    nullable: false,
  })
  saving_name: string;

  @ApiProperty({
    example: 0,
    description: '업체 밴 여부. defaule=0, 밴 되었을 경우 1',
    required: true,
  })
  @Column('int', { name: 'isBan', nullable: false, default: 0 })
  isBan: number;

  @Column('int', { name: 'user_id', nullable: true })
  user_id: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  /* ------------------------ 관계 mapping --------------------------- */

  // 1. teacher
  @OneToOne(() => Teacher, (teacher) => teacher.MyCompany)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'user_id' }])
  President: Teacher;

  // 2. company_application
  @OneToMany(
    () => CompanyApplication,
    (companyApplication) => companyApplication.AppliedCompany,
  )
  AppliedCompanyList: CompanyApplication[];
}
