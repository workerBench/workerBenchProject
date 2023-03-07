import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    requestWorkshops(): Promise<import("../entities/workshop").WorkShop[]>;
    approveWorkshop(id: number): Promise<{
        message: string;
    }>;
    rejectWorkshop(id: number): Promise<{
        message: string;
    }>;
    getApprovedWorkshops(): Promise<import("../entities/workshop").WorkShop[]>;
}
