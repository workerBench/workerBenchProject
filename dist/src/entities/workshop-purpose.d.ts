import { PurposeTag } from './purpose-tag';
import { WorkShop } from './workshop';
export declare class WorkShopPurpose {
    id: number;
    workshop_id: number | null;
    purpose_tag_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    Workshop: WorkShop;
    PurPoseTag: PurposeTag;
}
