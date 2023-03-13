import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user';
import { WorkShop } from './workshop';

@Entity({ schema: 'workerbench', name: 'workshop_instance_detail' })
export class WorkShopInstanceDetail {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsString({ message: '단체명을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '단체명을 입력해 주세요' })
  @ApiProperty({
    example: '가나다 회사',
    description: '워크샵을 신청하는 회사 혹은 단체',
    required: true,
  })
  @Column('varchar', { name: 'company', length: 50, nullable: false })
  company: string;

  @IsString({ message: '신청자의 성함을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '신청자의 성함을 입력해 주세요' })
  @ApiProperty({
    example: '김민수',
    description: '신청자 이름',
    required: true,
  })
  @Column('varchar', { name: 'name', length: 20, nullable: false })
  name: string;

  @IsEmail()
  @IsString({ message: '이메일을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '이메일을 입력해 주세요' })
  @ApiProperty({
    example: 'lololo@efj.com',
    description: '워크샵 수강 문의를 제출한 유저의 이메일',
    required: true,
  })
  @Column('varchar', {
    name: 'email',
    length: 50,
    nullable: false,
  })
  email: string;

  @IsString({ message: '전화번호를 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '전화번호를 입력해 주세요' })
  @Matches(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/)
  @ApiProperty({
    example: '01022224444',
    description: '수강 문의 신청자의 전화번호. `-` 제외',
    required: true,
  })
  @Column('varchar', { name: 'phone_number', length: 50, nullable: false })
  phone_number: string;

  @IsString({ message: '희망하는 날짜를 정확히 선택해 주세요' })
  @IsNotEmpty({ message: '희망하는 날짜를 선택해 주세요' })
  @ApiProperty({
    example: '2023-03-10',
    description: '희망하는 워크샵 수강일',
    required: true,
  })
  @Column('varchar', { name: 'wish_date', length: 50, nullable: false })
  wish_date: string;

  @Column('varchar', {
    name: 'status',
    length: 20,
    nullable: false,
    default: 'request',
  })
  status: 'request' | 'non_payment' | 'waiting_lecture' | 'complete';

  @IsString()
  @IsNotEmpty({ message: '워크샵을 희망하시는 이유를 적어주세요' })
  @ApiProperty({
    example: '안녕하세요 전....',
    description: '워크샵을 통해 이루고자 하는 바',
    required: true,
  })
  @Column('varchar', { name: 'purpose', length: 200, nullable: false })
  purpose: string;

  @IsString()
  @IsNotEmpty({ message: '원하시는 워크샵 수행 위치를 기입해 주세요' })
  @ApiProperty({
    example: '서울시 종로구 OO',
    description: '워크샵을 희망하는 위치. 단, 워크샵 유형이 오프라인일 경우.',
    required: false,
  })
  @Column('varchar', { name: 'wish_location', length: 100, nullable: true })
  wish_location: string | null;

  @Type(() => Number) // 숫자 타입으로 변환
  @IsNumber()
  @IsNotEmpty({ message: '희망하시는 인원을 적어 주세요' })
  @ApiProperty({
    example: 20,
    description: '워크샵에 참가하길 희망하는 총 인원',
    required: true,
  })
  @Column('int', { name: 'member_cnt', nullable: false })
  member_cnt: number;

  @IsString()
  @ApiProperty({
    example: '기타 문의사항은 다음과 같습니다...',
    description: '워크샵 수강 문의 등록 시 기타 문의 사항 기록',
    required: false,
  })
  @Column('text', { name: 'etc', nullable: true })
  etc: string | null;

  @IsString()
  @IsNotEmpty({ message: 'online, offline 둘 중 하나를 택해 주세요' })
  @ApiProperty({
    example: 'online',
    description:
      '워크샵 수강 문의 등록 시 신쳥 유형이 오프라인인지 온라인인지 명시',
    required: false,
  })
  @Column('varchar', { name: 'category', length: 100, nullable: false })
  category: 'online' | 'offline';

  @Column('int', { name: 'user_id', nullable: true })
  user_id: number | null;

  @Column('int', { name: 'workshop_id', nullable: true })
  workshop_id: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  /* ------------------------ 관계 mapping --------------------------- */

  // 1. user
  @ManyToOne(() => User, (user) => user.MyInstances, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  Writer: User;

  // 2. workshop
  @ManyToOne(() => WorkShop, (workshop) => workshop.WorkShopInstances, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workshop_id', referencedColumnName: 'id' }])
  Workshop: User;
}
