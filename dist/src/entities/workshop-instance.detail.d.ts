import { CommonEntity } from 'src/common/entities/common.entity';
export declare class WorkShopInstanceDetail extends CommonEntity {
    id: number;
    company: string;
    name: string;
    email: string;
    phone_number: string;
    wish_date: string;
    status: string;
    purpose: string;
    wish_location: string | null;
    member_cnt: number;
    etc: string | null;
    category: 'online' | 'offline';
    user_id: number | null;
    workshop_id: number | null;
}
