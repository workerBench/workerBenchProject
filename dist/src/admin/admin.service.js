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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Repository_1 = require("typeorm/repository/Repository");
const workshop_1 = require("../entities/workshop");
let AdminService = class AdminService {
    constructor(workshopRepository) {
        this.workshopRepository = workshopRepository;
    }
    async requestWorkshops() {
        return await this.workshopRepository.find({
            where: { status: "request" }
        });
    }
    async approveWorkshop(id) {
        const workshop = await this.workshopRepository.findOne({
            where: { id, status: "request" }
        });
        if (!workshop || workshop.status !== "request") {
            throw new common_1.NotFoundException("없는 워크숍입니다.");
        }
        return await this.workshopRepository.update(id, { status: "approval" });
    }
    async rejectWorkshop(id) {
        const workshop = await this.workshopRepository.findOne({
            where: { id, status: "request" }
        });
        if (!workshop || workshop.status !== "request") {
            throw new common_1.NotFoundException("없는 워크숍입니다.");
        }
        return await this.workshopRepository.update(id, { status: "rejected" });
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(workshop_1.WorkShop)),
    __metadata("design:paramtypes", [Repository_1.Repository])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map