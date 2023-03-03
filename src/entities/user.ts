import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'workerbench', name: 'user' })
export class User extends CommonEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsEmail()
  @IsString({ message: '이메일을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '이메일을 입력해 주세요' })
  @ApiProperty({
    example: 'lololo@efj.com',
    description: '유저 이메일',
    required: true,
  })
  @Column('varchar', {
    name: 'email',
    unique: true,
    length: 50,
    nullable: false,
  })
  email: string;

  @Exclude()
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

  @ApiProperty({
    example: 0,
    description: '해당 유저의 강사 등록 여부. default=0, 강사 등록 시 1',
    required: false,
  })
  @Column('int', {
    name: 'user_type',
    nullable: false,
    default: 0,
  })
  user_type: number;

  @ApiProperty({
    example: 0,
    description: '업체 밴 여부. defaule=0, 밴 되었을 경우 1',
    required: true,
  })
  @Column('int', { name: 'isBan', nullable: false, default: 0 })
  isBan: number;
}
