import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'workerbench', name: 'workshop_purpose' })
export class WorkShopPurpose {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'workshop_id', nullable: false })
  workshop_id: number;

  @Column('int', { name: 'purpose_tag_id', nullable: false })
  purpose_tag_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
