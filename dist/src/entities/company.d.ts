import { CommonEntity } from 'src/common/entities/common.entity';
export declare class company extends CommonEntity {
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
}
