import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'workerbench', name: 'workshop_purpose' })
export class WorkShopPurpose extends CommonEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'workshop_id', nullable: false })
  workshop_id: number;

  @Column('int', { name: 'purpose_tag_id', nullable: false })
  purpose_tag_id: number;
}
