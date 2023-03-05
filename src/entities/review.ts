import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'workerbench', name: 'review_image' })
export class Review {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsString({ message: '후기 내용을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '후기 내용을 입력해 주세요' })
  @ApiProperty({
    example: '이번 워크샵에 참가했던 OOO 입니다. 저는 이 워크샵을 수료...',
    description: '워크샵을 수료한 학생이 리뷰를 남길 시 포함되는 글.',
    required: true,
  })
  @Column('text', { name: 'content', nullable: false })
  content: string;

  @IsNumber()
  @IsNotEmpty({ message: '별점을 1점 이상 입력해 주세요' })
  @ApiProperty({
    example: '3',
    description: '별점. 3.5 등도 가능.',
    required: true,
  })
  @Column('decimal', { name: 'star', nullable: false })
  star: number;

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
}
