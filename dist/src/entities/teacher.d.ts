import { Company } from './company';
import { CompanyApplication } from './company-application';
import { User } from './user';
export declare class Teacher {
    user_id: number;
    phone_number: string;
    address: string;
    name: string;
    affiliation_company_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    User: User;
    MyCompany: Company;
    AffiliationCompany: Company;
    ApplicationList: CompanyApplication[];
}
