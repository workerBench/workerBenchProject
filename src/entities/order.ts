import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
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

@Entity({ schema: 'workerbench', name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsString({ message: '결제 고유번호를 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '결제 고유번호를 입력해 주세요' })
  @ApiProperty({
    example: '1643289-4284937',
    description:
      '외부 API 를 통해 결제를 하였을 경우 얻을 수 있는 결제 고유 번호',
    required: true,
  })
  @Column('varchar', { name: 'imp_uid', length: 100, nullable: false })
  imp_uid: string;

  @IsNumber()
  @IsNotEmpty({ message: '결제된 금액을 입력해 주세요' })
  @ApiProperty({
    example: '39800',
    description: '실제로 결제된 금액',
    required: true,
  })
  @Column('int', { name: 'amount', nullable: false })
  amount: number;

  @IsString({ message: '결제 시 이용한 방법을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '결제 시 이용한 방법을 입력해 주세요' })
  @ApiProperty({
    example: 'card',
    description: '실제로 결제에 사용한 수단',
    required: true,
  })
  @Column('varchar', { name: 'pay_method', length: 50, nullable: false })
  pay_method: string;

  @IsString({ message: '결제 상태를 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '결제 상태를 입력해 주세요' })
  @ApiProperty({
    example: 'paid',
    description: '최종적으로 금액이 지불되었는가 여부',
    required: true,
  })
  @Column('varchar', { name: 'status', length: 20, nullable: false })
  status: string;

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
  @ManyToOne(() => User, (user) => user.MyOrders, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  Payer: User;

  // 2. workshop
  @ManyToOne(() => WorkShop, (workshop) => workshop.Orders, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workshop_id', referencedColumnName: 'id' }])
  Workshop: WorkShop;
}
