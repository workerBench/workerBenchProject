import { Repository } from 'typeorm/repository/Repository';
import { WorkShop } from '../entities/workshop';
export declare class AdminService {
    private workshopRepository;
    constructor(workshopRepository: Repository<WorkShop>);
    requestWorkshops(): Promise<WorkShop[]>;
    approveWorkshop(id: number): Promise<import("typeorm").UpdateResult>;
    rejectWorkshop(id: number): Promise<import("typeorm").UpdateResult>;
    getApprovedWorkshops(): Promise<WorkShop[]>;
    updateWorkshop(id: number, title: string, category: "online" | "offline", desc: string, thumb: string, min_member: number, max_member: number, total_time: number, price: number, location: string): Promise<import("typeorm").UpdateResult>;
}
