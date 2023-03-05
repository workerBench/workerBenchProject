import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    requestWorkshops(): Promise<import("../entities/workshop").WorkShop[]>;
}
