import { WorkshopsService } from 'src/workshops/workshops.service';
export declare class WorkshopsController {
    private readonly workshopsService;
    constructor(workshopsService: WorkshopsService);
    getBestWorkshops(): Promise<void>;
    getNewWorkshops(): Promise<import("../entities/workshop").WorkShop[]>;
    getApprovedWorkshops(): Promise<import("../entities/workshop").WorkShop[]>;
    getWorkshopDetail(id: number): Promise<import("../entities/workshop").WorkShop>;
    addToWish(workshop_id: number): Promise<"찜하기 성공!" | "찜하기 취소!">;
    GetWorkshopReviews(id: number): Promise<import("../entities/workshop").WorkShop[]>;
    workshopOrder(): void;
}
