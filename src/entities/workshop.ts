import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'workerbench', name: 'workshop' })
export class WorkShop extends CommonEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty({ message: '워크샵 제목을 입력해 주세요' })
  @ApiProperty({
    example: '팀웍 증진을 위한 워크샵',
    description: '워크샵 제목',
    required: true,
  })
  @Column('varchar', { name: 'title', length: 50, nullable: false })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '워크샵 유형을 입력해 주세요' })
  @ApiProperty({
    example: 'online',
    description: 'online 혹은 offline',
    required: true,
  })
  @Column('varchar', { name: 'category', length: 50, nullable: false })
  category: 'online' | 'offline';

  @IsString()
  @IsNotEmpty({ message: '워크샵에 대한 설명을 작성해 주세요.' })
  @ApiProperty({
    example: '이 워크샵이 만들어진 목적은....',
    description: '워크샵 상세 설명',
    required: true,
  })
  @Column('text', { name: 'desc', nullable: false })
  desc: string;

  @IsString()
  @IsNotEmpty({ message: '썸네일 파일 이름 입력' })
  @ApiProperty({
    example: '342432jkl.jpg',
    description: '워크샵 썸네일 사진 파일명',
    required: true,
  })
  @Column('varchar', { name: 'thumb', length: 50, nullable: false })
  thumb: string;

  @IsNumber()
  @IsNotEmpty({ message: '워크샵 최소 인원을 설정해 주세요' })
  @ApiProperty({
    example: 5,
    description: '워크샵 최소 인원 설정.',
    required: true,
  })
  @Column('int', { name: 'min_member', nullable: false })
  min_member: number;

  @IsNumber()
  @IsNotEmpty({ message: '워크샵 최대 인원을 설정해 주세요' })
  @ApiProperty({
    example: 5,
    description: '워크샵 최대 인원 설정.',
    required: true,
  })
  @Column('int', { name: 'max_member', nullable: false })
  max_member: number;

  @IsNumber()
  @IsNotEmpty({ message: '워크샵 총 일정의 시간을 기입해 주세요' })
  @ApiProperty({
    example: 130,
    description: '워크샵 총 과정에 소요되는 시간. 분 단위.',
    required: true,
  })
  @Column('int', { name: 'total_time', nullable: false })
  total_time: number;

  @IsNumber()
  @IsNotEmpty({ message: '워크샵 참가 인원 1인당 비용을 설정해 주세요' })
  @ApiProperty({
    example: 45000,
    description: '워크샵 참가 인원 1인당 비용.',
    required: true,
  })
  @Column('int', { name: 'price', nullable: false })
  price: number;

  @Column('varchar', {
    name: 'status',
    length: 50,
    nullable: false,
    default: 'request',
  })
  status: 'request' | 'approval' | 'rejected' | 'finished';

  @IsString()
  @IsNotEmpty({ message: '워크샵 운영이 가능한 지역을 적어주세요' })
  @ApiProperty({
    example: '서울, 경기, 인천 가능합니다.',
    description:
      '워크샵 운영 가능 지역. 카테고리(유형) 가 offline 일 경우 함께 기입',
    required: false,
  })
  @Column('varchar', { name: 'location', length: 100, nullable: true })
  location: string | null;

  @Column('int', { name: 'user_id', nullable: true })
  user_id: number | null;

  @Column('int', { name: 'genre_id', nullable: true })
  genre_id: number | null;
}
