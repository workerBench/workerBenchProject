import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'workerbench', name: 'company_application' })
export class CompanyApplication {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'teacher_id', nullable: true })
  teacher_id: number | null;

  @Column('int', { name: 'company_id', nullable: true })
  company_id: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
