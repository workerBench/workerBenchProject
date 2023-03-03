import { CommonEntity } from 'src/common/entities/common.entity';
export declare class Teacher extends CommonEntity {
    user_id: number;
    phone_number: string;
    address: string;
    name: string;
    affiliation_company_id: number | null;
    possession_company_id: number | null;
}
