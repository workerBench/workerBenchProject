import { PurposeTag } from './purpose-tag';
import { WorkShop } from './workshop';
export declare class WorkShopPurpose {
    id: number;
    workshop_id: number;
    purpose_tag_id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    Workshop: WorkShop;
    PurPoseTag: PurposeTag;
}
