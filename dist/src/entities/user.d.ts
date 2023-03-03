import { CommonEntity } from 'src/common/entities/common.entity';
export declare class User extends CommonEntity {
    id: number;
    email: string;
    password: string;
    user_type: number;
    isBan: number;
}
