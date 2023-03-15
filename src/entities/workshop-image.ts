import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
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
import { WorkShop } from './workshop';

@Entity({ schema: 'workerbench', name: 'workshop_image' })
export class WorkShopImage {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsString({ message: '첨부한 이미지 이름을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '첨부한 이미지 이름을 입력해 주세요' })
  @ApiProperty({
    example: '36k6hjk452jhk6.jpeg',
    description: '워크샵 상품 등록 시 첨부하는 이미지',
    required: true,
  })
  @Column('varchar', { name: 'img_name', length: 50, nullable: false })
  img_name: string;

  @ApiProperty({
    example: 1,
    description: '워크샵 PK',
    required: true,
  })
  @Column('int', { name: 'workshop_id', nullable: true })
  workshop_id: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  /* ------------------------ 관계 mapping --------------------------- */

  // 1. workshop
  @ManyToOne(() => WorkShop, (workshop) => workshop.Images, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workshop_id', referencedColumnName: 'id' }])
  Workshop: WorkShop;
}
