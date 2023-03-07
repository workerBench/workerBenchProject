import { CompanyApplication } from './company-application';
import { Teacher } from './teacher';
export declare class Company {
    id: number;
    company_type: number;
    company_name: string;
    business_number: number | null;
    rrn_front: number | null;
    rrn_back: number | null;
    bank_name: string;
    account: number;
    saving_name: string;
    isBan: number;
    user_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    President: Teacher;
    EmployeeList: Teacher[];
    AppliedCompanyList: CompanyApplication[];
}
