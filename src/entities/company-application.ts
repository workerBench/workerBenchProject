import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from './company';
import { Teacher } from './teacher';

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

  /* ------------------------ 관계 mapping --------------------------- */

  // // 1. teacer
  // @ManyToOne(() => Teacher, (teacher) => teacher.ApplicationList, {
  //   onDelete: 'SET NULL',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'teacher_id', referencedColumnName: 'user_id' }])
  // Teacher: Teacher;

  // // 2. company
  // @ManyToOne(() => Company, (company) => company.AppliedCompanyList, {
  //   onDelete: 'SET NULL',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  // AppliedCompany: Company;
}
