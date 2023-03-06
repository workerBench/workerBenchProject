import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkShop } from './workshop';
import { Teacher } from './teacher';
import { WishList } from './wish-list';
import { Review } from './review';
import { WorkShopInstanceDetail } from './workshop-instance.detail';
import { Order } from './order';

@Entity({ schema: 'workerbench', name: 'user' })
export class User {
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
    select: false,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  /* ------------------------ 관계 mapping --------------------------- */

  // 1. workshop
  @OneToMany(() => WorkShop, (workshop) => workshop.Owner)
  MyWorkshops: WorkShop[];

  // 2. teacher
  @OneToOne(() => Teacher, (teacher) => teacher.User)
  TeacherProfile: Teacher;

  // 3. wish_list
  @OneToMany(() => WishList, (wishlist) => wishlist.User)
  MyWishList: WishList[];

  // 4. review
  @OneToMany(() => Review, (review) => review.Writer)
  MyReviews: Review[];

  // 5. workshop_instance_detail
  @OneToMany(
    () => WorkShopInstanceDetail,
    (workShopInstanceDetail) => workShopInstanceDetail.Writer,
  )
  MyInstances: WorkShopInstanceDetail[];

  // 6. order
  @OneToMany(() => Order, (order) => order.Payer)
  MyOrders: [];
}
