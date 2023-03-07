import { ReviewImage } from './review-image';
import { User } from './user';
import { WorkShop } from './workshop';
export declare class Review {
    id: number;
    content: string;
    star: number;
    user_id: number | null;
    workshop_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    Writer: User;
    Workshop: WorkShop;
    ReviewImages: ReviewImage[];
}
