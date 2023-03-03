import { CommonEntity } from 'src/common/entities/common.entity';
export declare class AdminUser extends CommonEntity {
    id: number;
    email: string;
    password: string;
    name: string;
    phone_number: string;
    admin_type: string;
}
