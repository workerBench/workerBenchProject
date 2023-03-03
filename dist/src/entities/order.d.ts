import { CommonEntity } from 'src/common/entities/common.entity';
export declare class Order extends CommonEntity {
    id: number;
    imp_uid: string;
    amount: number;
    pay_method: string;
    status: string;
    user_id: number | null;
    workshop_id: number | null;
}
