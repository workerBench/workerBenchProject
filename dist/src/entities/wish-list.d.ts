import { User } from './user';
import { WorkShop } from './workshop';
export declare class WishList {
    id: number;
    user_id: number | null;
    workshop_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    User: User;
    Workshop: WorkShop;
}
