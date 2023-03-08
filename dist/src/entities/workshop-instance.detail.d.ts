export declare class WorkShopInstanceDetail {
    id: number;
    company: string;
    name: string;
    email: string;
    phone_number: string;
    wish_date: string;
    status: 'request' | 'non_payment' | 'waiting_lecture' | 'complete';
    purpose: string;
    wish_location: string | null;
    member_cnt: number;
    etc: string | null;
    category: 'online' | 'offline';
    user_id: number | null;
    workshop_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
