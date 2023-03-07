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
const wish_list_1 = require("../entities/wish-list");
const workshop_1 = require("../entities/workshop");
const typeorm_2 = require("typeorm");
let WorkshopsService = class WorkshopsService {
    constructor(workshopRepository, wishRepository) {
        this.workshopRepository = workshopRepository;
        this.wishRepository = wishRepository;
    }
    getBestWorkshops() { }
    async getNewWorkshops() {
        return await this.workshopRepository.find({
            order: { createdAt: 'DESC' },
            take: 8,
        });
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
    async getWorkshopReviews(id) {
        return await this.workshopRepository.find();
    }
};
WorkshopsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(workshop_1.WorkShop)),
    __param(1, (0, typeorm_1.InjectRepository)(wish_list_1.WishList)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WorkshopsService);
exports.WorkshopsService = WorkshopsService;
//# sourceMappingURL=workshops.service.js.map