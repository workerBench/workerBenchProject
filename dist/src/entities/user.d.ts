import { WorkShop } from './workshop';
import { Teacher } from './teacher';
import { WishList } from './wish-list';
import { Review } from './review';
import { WorkShopInstanceDetail } from './workshop-instance.detail';
export declare class User {
    id: number;
    email: string;
    password: string;
    user_type: number;
    isBan: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    MyWorkshops: WorkShop[];
    TeacherProfile: Teacher;
    MyWishList: WishList[];
    MyReviews: Review[];
    MyInstances: WorkShopInstanceDetail[];
    MyOrders: [];
}
