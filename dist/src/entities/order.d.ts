import { User } from './user';
import { WorkShop } from './workshop';
export declare class Order {
    id: number;
    imp_uid: string;
    amount: number;
    pay_method: string;
    status: string;
    user_id: number | null;
    workshop_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    Payer: User;
    Workshop: WorkShop;
}
