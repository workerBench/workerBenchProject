import { Company } from 'src/entities/company';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm/repository/Repository';
import { WorkShop } from '../entities/workshop';
export declare class AdminService {
    private workshopRepository;
    private userRepository;
    private companyRepository;
    constructor(workshopRepository: Repository<WorkShop>, userRepository: Repository<User>, companyRepository: Repository<Company>);
    requestWorkshops(): Promise<WorkShop[]>;
    approveWorkshop(id: number): Promise<import("typeorm").UpdateResult>;
    rejectWorkshop(id: number): Promise<import("typeorm").UpdateResult>;
    getApprovedWorkshops(): Promise<WorkShop[]>;
    updateWorkshop(id: number, title: string, category: "online" | "offline", desc: string, thumb: string, min_member: number, max_member: number, total_time: number, price: number, location: string): Promise<import("typeorm").UpdateResult>;
    removeWorkshop(id: number): Promise<import("typeorm").UpdateResult>;
    userBan(id: number): Promise<import("typeorm").UpdateResult>;
    companyBan(id: number): Promise<import("typeorm").UpdateResult>;
    searchWorkshops(title: string): Promise<WorkShop[]>;
}
