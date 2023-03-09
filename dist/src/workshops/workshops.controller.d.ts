import { OrderWorkshopDto } from 'src/workshops/dtos/order-workshop.dto';
import { SearchWorkshopDto } from 'src/workshops/dtos/search-workshop.dto';
import { WorkshopsService } from 'src/workshops/workshops.service';
export declare class WorkshopsController {
    private readonly workshopsService;
    constructor(workshopsService: WorkshopsService);
    getBestWorkshops(): Promise<any>;
    getNewWorkshops(): Promise<import("../entities/workshop").WorkShop[]>;
    getApprovedWorkshops(): Promise<import("../entities/workshop").WorkShop[]>;
    searchWorkshops(searchWorkshopData: SearchWorkshopDto): Promise<import("../entities/workshop").WorkShop[]>;
    getWorkshopDetail(id: number): Promise<import("../entities/workshop").WorkShop>;
    addToWish(workshop_id: number): Promise<"찜하기 성공!" | "찜하기 취소!">;
    getWorkshopReviews(workshop_id: number): Promise<import("../entities/review").Review[]>;
    orderWorkshop(workshop_id: number, orderWorkshopData: OrderWorkshopDto): string;
}
