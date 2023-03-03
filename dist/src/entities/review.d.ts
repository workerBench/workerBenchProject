import { CommonEntity } from 'src/common/entities/common.entity';
export declare class ReviewImage extends CommonEntity {
    id: number;
    content: string;
    star: number;
    user_id: number | null;
    workshop_id: number | null;
}
