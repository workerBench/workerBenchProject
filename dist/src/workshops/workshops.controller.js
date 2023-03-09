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
exports.WorkshopsController = void 0;
const common_1 = require("@nestjs/common");
const order_workshop_dto_1 = require("./dtos/order-workshop.dto");
const search_workshop_dto_1 = require("./dtos/search-workshop.dto");
const workshops_service_1 = require("./workshops.service");
let WorkshopsController = class WorkshopsController {
    constructor(workshopsService) {
        this.workshopsService = workshopsService;
    }
    async getBestWorkshops() {
        return await this.workshopsService.getBestWorkshops();
    }
    getNewWorkshops() {
        return this.workshopsService.getNewWorkshops();
    }
    async getApprovedWorkshops() {
        return await this.workshopsService.getApprovedWorkshops();
    }
    async searchWorkshops(searchWorkshopData) {
        return await this.workshopsService.searchWorkshops(searchWorkshopData);
    }
    async getWorkshopDetail(id) {
        return await this.workshopsService.getWorkshopDetail(id);
    }
    async addToWish(workshop_id) {
        const user_id = 2;
        return await this.workshopsService.addToWish(user_id, workshop_id);
    }
    async getWorkshopReviews(workshop_id) {
        return await this.workshopsService.getWorkshopReviews(workshop_id);
    }
    orderWorkshop(workshop_id, orderWorkshopData) {
        const user_id = 1;
        return this.workshopsService.orderWorkshop(workshop_id, user_id, orderWorkshopData);
    }
};
__decorate([
    (0, common_1.Get)('/best'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkshopsController.prototype, "getBestWorkshops", null);
__decorate([
    (0, common_1.Get)('/new'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkshopsController.prototype, "getNewWorkshops", null);
__decorate([
    (0, common_1.Get)('/approval'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkshopsController.prototype, "getApprovedWorkshops", null);
__decorate([
    (0, common_1.Get)('/search'),
    __param(0, (0, common_1.Query)('searchWorkshopData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_workshop_dto_1.SearchWorkshopDto]),
    __metadata("design:returntype", Promise)
], WorkshopsController.prototype, "searchWorkshops", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WorkshopsController.prototype, "getWorkshopDetail", null);
__decorate([
    (0, common_1.Post)('/:workshop_id/wish'),
    __param(0, (0, common_1.Param)('workshop_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WorkshopsController.prototype, "addToWish", null);
__decorate([
    (0, common_1.Get)(':workshop_id/reviews'),
    __param(0, (0, common_1.Param)('workshop_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WorkshopsController.prototype, "getWorkshopReviews", null);
__decorate([
    (0, common_1.Post)(':workshop_id/order'),
    __param(0, (0, common_1.Param)('workshop_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, order_workshop_dto_1.OrderWorkshopDto]),
    __metadata("design:returntype", void 0)
], WorkshopsController.prototype, "orderWorkshop", null);
WorkshopsController = __decorate([
    (0, common_1.Controller)('/api/workshops'),
    __metadata("design:paramtypes", [workshops_service_1.WorkshopsService])
], WorkshopsController);
exports.WorkshopsController = WorkshopsController;
//# sourceMappingURL=workshops.controller.js.map