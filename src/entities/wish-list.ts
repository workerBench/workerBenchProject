import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
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

@Entity({ schema: 'workerbench', name: 'wish_list' })
export class WishList {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id', nullable: true })
  user_id: number;

  @IsNotEmpty({ message: '찜하고 싶은 워크샵을 정확히 선택해 주세요' })
  @ApiProperty({
    example: 1,
    description: '워크샵 PK',
    required: true,
  })
  @Column('int', { name: 'workshop_id', nullable: true })
  workshop_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  /* ------------------------ 관계 mapping --------------------------- */

  // 1. user
  @ManyToOne(() => User, (user) => user.MyWishList, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: User;

  // 2. workshop
  @ManyToOne(() => WorkShop, (workshop) => workshop.WishList, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workshop_id', referencedColumnName: 'id' }])
  Workshop: WorkShop;
}
