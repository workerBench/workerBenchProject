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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const edit_workshop_dto_1 = require("./dto/edit-workshop.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async requestWorkshops() {
        const requestWorkshops = await this.adminService.requestWorkshops();
        return requestWorkshops;
    }
    async approveWorkshop(id) {
        await this.adminService.approveWorkshop(id);
        return { message: "워크숍이 승인 되었습니다." };
    }
    async rejectWorkshop(id) {
        await this.adminService.rejectWorkshop(id);
        return { message: "워크숍이 반려 되었습니다." };
    }
    async getApprovedWorkshops() {
        const workshops = await this.adminService.getApprovedWorkshops();
        return workshops;
    }
    async updateWorkshop(id, data) {
        const workshop = await this.adminService.updateWorkshop(id, data.title, data.category, data.desc, data.thumb, data.min_member, data.max_member, data.total_time, data.price, data.location);
        return { message: "워크숍 수정이 완료되었습니다." };
    }
    async removeWorkshop(id) {
        await this.adminService.removeWorkshop(id);
        return { message: "워크숍이 삭제되었습니다." };
    }
    async userBan(id) {
        await this.adminService.userBan(id);
        return { message: "유저가 밴 처리 되었습니다." };
    }
    async companyBan(id) {
        await this.adminService.companyBan(id);
        return { message: "업체가 밴 처리 되었습니다." };
    }
};
__decorate([
    (0, common_1.Get)('/workshops/request'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "requestWorkshops", null);
__decorate([
    (0, common_1.Patch)('/workshop/approval/:id'),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveWorkshop", null);
__decorate([
    (0, common_1.Patch)('/workshop/rejected/:id'),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectWorkshop", null);
__decorate([
    (0, common_1.Get)('/workshops'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getApprovedWorkshops", null);
__decorate([
    (0, common_1.Put)('/workshop/:id'),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, decorators_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, edit_workshop_dto_1.editWorkshopDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateWorkshop", null);
__decorate([
    (0, decorators_1.Delete)('workshop/:id'),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeWorkshop", null);
__decorate([
    (0, common_1.Patch)('ban/user'),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "userBan", null);
__decorate([
    (0, common_1.Patch)('ban/company'),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "companyBan", null);
AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('api/admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map