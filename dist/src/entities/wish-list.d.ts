import { User } from './user';
import { WorkShop } from './workshop';
export declare class WishList {
    id: number;
    user_id: number;
    workshop_id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    User: User;
    Workshop: WorkShop;
}
