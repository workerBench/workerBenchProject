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
exports.TeacherController = void 0;
const common_1 = require("@nestjs/common");
const current_user_dto_1 = require("../auth/dtos/current-user.dto");
const jwt_user_guard_1 = require("../auth/jwt/access/user/jwt-user-guard");
const user_decorator_1 = require("../common/decorators/user.decorator");
const CreateCompanyDto_1 = require("./dto/CreateCompanyDto");
const createTeacherDto_1 = require("./dto/createTeacherDto");
const createWorkshopsDto_1 = require("./dto/createWorkshopsDto");
const teacher_service_1 = require("./teacher.service");
let TeacherController = class TeacherController {
    constructor(teacherService) {
        this.teacherService = teacherService;
    }
    createTeacherRegister(data, user) {
        return this.teacherService.createTeacherRegister(user.id, data.phone_number, data.address, data.name);
    }
    async getTeacherWorkshops() {
        return await this.teacherService.getTeacherWorkshops();
    }
    async getTeacherMypage() {
        return await this.teacherService.getTeacherMypage();
    }
    createTeacherCompany(data, user) {
        return this.teacherService.createTeacherCompany(data.company_type, data.company_name, data.business_number, data.rrn_front, data.rrn_back, data.bank_name, data.account, data.saving_name, data.isBan, user.id);
    }
    createTeacherWorkshops(data) {
        return this.teacherService.createTeacherWorkshops(data.category, data.genre_id, data.title, data.desc, data.thumb, data.min_member, data.max_member, data.total_time, data.price, data.location);
    }
    getTeacherRequest() {
        return this.teacherService.getTeacherRequest();
    }
    getTeacherComplete() {
        return this.teacherService.getTeacherComplete();
    }
    updateTeacherAccept(id) {
        return this.teacherService.updateTeacherAccept(id);
    }
    updateTeacherComplete(id) {
        return this.teacherService.updateTeacherComplete(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_user_guard_1.JwtUserAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createTeacherDto_1.createTeacherDto, current_user_dto_1.CurrentUserDto]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "createTeacherRegister", null);
__decorate([
    (0, common_1.Get)('workshops'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "getTeacherWorkshops", null);
__decorate([
    (0, common_1.Get)('mypage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "getTeacherMypage", null);
__decorate([
    (0, common_1.Post)('company'),
    (0, common_1.UseGuards)(jwt_user_guard_1.JwtUserAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCompanyDto_1.createCompanyDto, current_user_dto_1.CurrentUserDto]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "createTeacherCompany", null);
__decorate([
    (0, common_1.Post)('workshops'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createWorkshopsDto_1.createWorkshopsDto]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "createTeacherWorkshops", null);
__decorate([
    (0, common_1.Get)('workshops/request'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getTeacherRequest", null);
__decorate([
    (0, common_1.Get)('workshops/complete'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getTeacherComplete", null);
__decorate([
    (0, common_1.Patch)('workshops/manage/accept/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "updateTeacherAccept", null);
__decorate([
    (0, common_1.Patch)('workshops/manage/complete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "updateTeacherComplete", null);
TeacherController = __decorate([
    (0, common_1.Controller)('/api/teacher'),
    __metadata("design:paramtypes", [teacher_service_1.TeacherService])
], TeacherController);
exports.TeacherController = TeacherController;
//# sourceMappingURL=teacher.controller.js.map