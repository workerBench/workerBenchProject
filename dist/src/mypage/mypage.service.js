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
exports.MypageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const review_1 = require("../entities/review");
const review_image_1 = require("../entities/review-image");
const wish_list_1 = require("../entities/wish-list");
const typeorm_2 = require("typeorm");
let MypageService = class MypageService {
    constructor(wishRepository, reviewRepository, reviewImageRepository) {
        this.wishRepository = wishRepository;
        this.reviewRepository = reviewRepository;
        this.reviewImageRepository = reviewImageRepository;
    }
    getWorkshops() {
        return this.mypage;
    }
    async getBeforeWorkshops() {
        return await this.workshopRepository.find({
            where: { status: 'request', 'approval':  },
            order: { updatedAt: 'DESC' },
        });
    }
    async getFinishedWorkshops() {
        return await this.workshopRepository.find({
            where: { status: 'finished' },
            order: { updatedAt: 'DESC' },
        });
    }
    review(workshop_id, user_id, reviewDto) {
        const { content, star, } = reviewDto;
        this.reviewRepository.insert({
            content,
            star,
        });
        return '리뷰 등록이 완료되었습니다.';
    }
    reviewImage(reviewImageDto) {
        const { img_name, } = reviewImageDto;
        this.reviewImageRepository.insert({
            img_name,
        });
        return '리뷰 사진 등록이 완료되었습니다.';
    }
};
MypageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wish_list_1.WishList)),
    __param(1, (0, typeorm_1.InjectRepository)(review_1.Review)),
    __param(2, (0, typeorm_1.InjectRepository)(review_image_1.ReviewImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MypageService);
exports.MypageService = MypageService;
//# sourceMappingURL=mypage.service.js.map