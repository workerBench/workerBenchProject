import { Company } from './company';
import { Teacher } from './teacher';
export declare class CompanyApplication {
    id: number;
    teacher_id: number | null;
    company_id: number | null;
    createdAt: Date;
    Teacher: Teacher;
    AppliedCompany: Company;
}
