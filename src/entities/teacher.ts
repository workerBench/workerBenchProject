import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}
