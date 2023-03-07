import { WorkShop } from './workshop';
export declare class WorkShopImage {
    id: number;
    img_name: string;
    workshop_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    Workshop: WorkShop;
}
