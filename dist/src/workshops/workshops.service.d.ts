import { WishList } from 'src/entities/wish-list';
import { WorkShop } from 'src/entities/workshop';
import { Repository } from 'typeorm';
export declare class WorkshopsService {
    private readonly workshopRepository;
    private readonly wishRepository;
    constructor(workshopRepository: Repository<WorkShop>, wishRepository: Repository<WishList>);
    getBestWorkshops(): void;
    getNewWorkshops(): Promise<WorkShop[]>;
    getApprovedWorkshops(): Promise<WorkShop[]>;
    getWorkshopDetail(id: number): Promise<WorkShop>;
    addToWish(user_id: number, workshop_id: number): Promise<"찜하기 성공!" | "찜하기 취소!">;
    getWorkshopReviews(id: number): Promise<WorkShop[]>;
}
