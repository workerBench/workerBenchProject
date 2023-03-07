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
import { Review } from './review';

@Entity({ schema: 'workerbench', name: 'review_image' })
export class ReviewImage {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsString({ message: '첨부한 이미지 이름을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '첨부한 이미지 이름을 입력해 주세요' })
  @ApiProperty({
    example: '36k6hjk452jhk6.jpeg',
    description:
      '워크샵을 수강 완료한 학생이 해당 워크샵에 후기를 남길 때 이미지를 첨부하는 경우 입력됨.',
    required: true,
  })
  @Column('varchar', { name: 'img_name', length: 50, nullable: false })
  img_name: string;

  @Column('int', { name: 'review_id', nullable: true })
  review_id: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  /* ------------------------ 관계 mapping --------------------------- */

  // // 1. review
  // @ManyToOne(() => Review, (reivew) => reivew.ReviewImages, {
  //   onDelete: 'SET NULL',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'review_id', referencedColumnName: 'id' }])
  // Review: Review;
}
