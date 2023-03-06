import { Repository } from 'typeorm/repository/Repository';
import { WorkShop } from '../entities/workshop';
export declare class AdminService {
    private workshopRepository;
    constructor(workshopRepository: Repository<WorkShop>);
    requestWorkshops(): Promise<WorkShop[]>;
    approveWorkshop(id: number): Promise<import("typeorm").UpdateResult>;
    rejectWorkshop(id: number): Promise<import("typeorm").UpdateResult>;
    getApprovedWorkshops(): Promise<WorkShop[]>;
}
