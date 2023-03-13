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
import { PurposeTag } from './purpose-tag';
import { WorkShop } from './workshop';

@Entity({ schema: 'workerbench', name: 'workshop_purpose' })
export class WorkShopPurpose {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'workshop_id', nullable: true })
  workshop_id: number | null;

  @Column('int', { name: 'purpose_tag_id', nullable: true })
  purpose_tag_id: number[] | number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  /* ------------------------ 관계 mapping --------------------------- */

  // 1. workshop
  @ManyToOne(() => WorkShop, (workshop) => workshop.PurposeList, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workshop_id', referencedColumnName: 'id' }])
  Workshop: WorkShop;

  // 2. purpose_tag
  @ManyToOne(() => PurposeTag, (purposeTag) => purposeTag.WorkShopPurPoseList, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'purpose_tag_id', referencedColumnName: 'id' }])
  PurPoseTag: PurposeTag;
}
