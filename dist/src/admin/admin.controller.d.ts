import { AdminService } from './admin.service';
import { editWorkshopDto } from './dto/edit-workshop.dto';
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
    updateWorkshop(id: number, data: editWorkshopDto): Promise<{
        message: string;
    }>;
    removeWorkshop(id: number): Promise<{
        message: string;
    }>;
    userBan(id: number): Promise<{
        message: string;
    }>;
    companyBan(id: number): Promise<{
        message: string;
    }>;
}
