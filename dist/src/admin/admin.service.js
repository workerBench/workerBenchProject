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
const company_1 = require("../entities/company");
const user_1 = require("../entities/user");
const Repository_1 = require("typeorm/repository/Repository");
const workshop_1 = require("../entities/workshop");
let AdminService = class AdminService {
    constructor(workshopRepository, userRepository, companyRepository) {
        this.workshopRepository = workshopRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
    }
    async requestWorkshops() {
        return await this.workshopRepository.find({
            where: { status: "request", deletedAt: null }
        });
    }
    async approveWorkshop(id) {
        const workshop = await this.workshopRepository.findOne({
            where: { id, status: "request", deletedAt: null }
        });
        if (!workshop || workshop.status !== "request") {
            throw new common_1.NotFoundException("없는 워크숍입니다.");
        }
        return await this.workshopRepository.update(id, { status: "approval" });
    }
    async rejectWorkshop(id) {
        const workshop = await this.workshopRepository.findOne({
            where: { id, status: "request", deletedAt: null }
        });
        if (!workshop || workshop.status !== "request") {
            throw new common_1.NotFoundException("없는 워크숍입니다.");
        }
        return await this.workshopRepository.update(id, { status: "rejected" });
    }
    async getApprovedWorkshops() {
        return await this.workshopRepository.find({
            where: { status: "approval", deletedAt: null }
        });
    }
    async updateWorkshop(id, title, category, desc, thumb, min_member, max_member, total_time, price, location) {
        const workshop = await this.workshopRepository.findOne({
            where: { id, status: "approval", deletedAt: null }
        });
        if (!workshop || workshop.status !== "approval") {
            throw new common_1.NotFoundException("없는 워크숍입니다.");
        }
        return await this.workshopRepository.update(id, {
            title, category, desc, thumb, min_member, max_member, total_time, price, location
        });
    }
    async removeWorkshop(id) {
        const workshop = await this.workshopRepository.findOne({
            where: { id, status: "approval" }
        });
        if (!workshop || workshop.status !== "approval") {
            throw new common_1.NotFoundException("없는 워크숍입니다.");
        }
        await this.workshopRepository.update(id, { status: "finished" });
        return await this.workshopRepository.softDelete(id);
    }
    async userBan(id) {
        const user = await this.userRepository.findOne({
            where: { id }
        });
        return await this.userRepository.update(id, { isBan: 1 });
    }
    async companyBan(id) {
        const company = await this.companyRepository.findOne({
            where: { id }
        });
        return await this.companyRepository.update(id, { isBan: 1 });
    }
    async searchWorkshops(titleOrEmail, searchField) {
        let query = this.workshopRepository.createQueryBuilder('workshop');
        if (searchField === 'title') {
            query = query.where('workshop.title LIKE :title', { title: `%${titleOrEmail}%` });
        }
        else if (searchField === 'email') {
            query = query
                .innerJoinAndSelect('workshop.user', 'user')
                .where('user.email LIKE :email', { email: `%${titleOrEmail}%` });
        }
        const workshops = await query.getMany();
        return workshops;
    }
    async searchUserOrCompany(EmailOrCompany, searchcField) {
        let query;
        if (searchcField === 'email') {
            query = this.userRepository
                .createQueryBuilder('user')
                .where('user.email Like :email', { email: `${EmailOrCompany}` });
        }
        else if (searchcField === "company") {
            query = this.companyRepository
                .createQueryBuilder('company')
                .where('company.company_name Like :company_name', { company_name: `%${EmailOrCompany}%` });
        }
        const result = await query.getMany();
        return result;
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(workshop_1.WorkShop)),
    __param(1, (0, typeorm_1.InjectRepository)(user_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(company_1.Company)),
    __metadata("design:paramtypes", [Repository_1.Repository,
        Repository_1.Repository,
        Repository_1.Repository])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map