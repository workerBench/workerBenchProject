"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkshopsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const review_1 = require("../entities/review");
const wish_list_1 = require("../entities/wish-list");
const workshop_instance_detail_1 = require("../entities/workshop-instance.detail");
const workshop_repository_1 = require("./workshop.repository");
const typeorm_2 = require("typeorm");
let WorkshopsService = class WorkshopsService {
    constructor(workshopRepository, wishRepository, workshopDetailRepository, reviewRepository) {
        this.workshopRepository = workshopRepository;
        this.wishRepository = wishRepository;
        this.workshopDetailRepository = workshopDetailRepository;
        this.reviewRepository = reviewRepository;
    }
    async getBestWorkshops() {
        return await this.workshopRepository.getWorkshopsByOrder();
    }
    async getNewWorkshops() {
        return await this.workshopRepository.find({
            order: { createdAt: 'DESC' },
            take: 8,
        });
    }
    async searchWorkshops(searchWorkshopData) {
        return await this.workshopRepository.find();
    }
    async getApprovedWorkshops() {
        return await this.workshopRepository.find({
            where: { status: 'approval' },
            order: { updatedAt: 'DESC' },
        });
    }
    async getWorkshopDetail(id) {
        return await this.workshopRepository.findOne({ where: { id } });
    }
    async addToWish(user_id, workshop_id) {
        const IsWish = await this.wishRepository.findOne({
            where: { user_id, workshop_id },
        });
        if (IsWish === null) {
            await this.wishRepository.insert({ user_id, workshop_id });
            return '찜하기 성공!';
        }
        await this.wishRepository.delete({ user_id, workshop_id });
        return '찜하기 취소!';
    }
    async getWorkshopReviews(workshop_id) {
        return await this.reviewRepository.find({
            where: { workshop_id, deletedAt: null },
        });
    }
    orderWorkshop(workshop_id, user_id, orderWorkshopDto) {
        const { company, name, email, phone_number, wish_date, purpose, wish_location, member_cnt, etc, category, } = orderWorkshopDto;
        this.workshopDetailRepository.insert({
            company,
            name,
            email,
            phone_number,
            wish_date,
            purpose,
            wish_location,
            member_cnt,
            etc,
            category,
            user_id,
            workshop_id,
        });
        return '워크샵 문의 신청이 완료되었습니다.';
    }
};
WorkshopsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(wish_list_1.WishList)),
    __param(2, (0, typeorm_1.InjectRepository)(workshop_instance_detail_1.WorkShopInstanceDetail)),
    __param(3, (0, typeorm_1.InjectRepository)(review_1.Review)),
    __metadata("design:paramtypes", [workshop_repository_1.WorkshopRepository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WorkshopsService);
exports.WorkshopsService = WorkshopsService;
//# sourceMappingURL=workshops.service.js.map