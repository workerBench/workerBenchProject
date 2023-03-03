import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'workerbench', name: 'admin_user' })
export class AdminUser extends CommonEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsEmail()
  @IsString({ message: '이메일을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '이메일을 입력해 주세요' })
  @ApiProperty({
    example: 'lololo@efj.com',
    description: '관리자 이메일',
    required: true,
  })
  @Column('varchar', {
    name: 'email',
    unique: true,
    length: 50,
    nullable: false,
  })
  email: string;

  @IsString({ message: '비밀번호를 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '비밀번호를 입력해 주세요' })
  @ApiProperty({
    example: '12345',
    description: 'password',
    required: true,
  })
  @Column('varchar', {
    name: 'password',
    length: 100,
    nullable: false,
  })
  password: string;

  @IsString({ message: '이름을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '이름을 입력해 주세요' })
  @ApiProperty({
    example: '김민수',
    description: 'name',
    required: true,
  })
  @Column('varchar', { name: 'name', length: 20, nullable: false })
  name: string;

  @IsString({ message: '전화번호를 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '전화번호를 입력해 주세요' })
  @ApiProperty({
    example: '01022223333',
    description: '전화번호',
    required: true,
  })
  @Column('varchar', { name: 'phone_number', length: 50, nullable: false })
  phone_number: string;

  @Column('varchar', {
    name: 'admin_type',
    length: 20,
    nullable: true,
    default: 'normal_admin',
  })
  admin_type: string;
}
