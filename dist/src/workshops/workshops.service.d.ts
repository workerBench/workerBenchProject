import { Review } from 'src/entities/review';
import { WishList } from 'src/entities/wish-list';
import { WorkShop } from 'src/entities/workshop';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';
import { OrderWorkshopDto } from 'src/workshops/dtos/order-workshop.dto';
import { SearchWorkshopDto } from 'src/workshops/dtos/search-workshop.dto';
import { WorkshopRepository } from 'src/workshops/workshop.repository';
import { Repository } from 'typeorm';
export declare class WorkshopsService {
    private readonly workshopRepository;
    private readonly wishRepository;
    private readonly workshopDetailRepository;
    private readonly reviewRepository;
    constructor(workshopRepository: WorkshopRepository, wishRepository: Repository<WishList>, workshopDetailRepository: Repository<WorkShopInstanceDetail>, reviewRepository: Repository<Review>);
    getBestWorkshops(): Promise<any>;
    getNewWorkshops(): Promise<WorkShop[]>;
    searchWorkshops(searchWorkshopData: SearchWorkshopDto): Promise<WorkShop[]>;
    getApprovedWorkshops(): Promise<WorkShop[]>;
    getWorkshopDetail(id: number): Promise<WorkShop>;
    addToWish(user_id: number, workshop_id: number): Promise<"찜하기 성공!" | "찜하기 취소!">;
    getWorkshopReviews(workshop_id: number): Promise<Review[]>;
    orderWorkshop(workshop_id: number, user_id: number, orderWorkshopDto: OrderWorkshopDto): string;
}
