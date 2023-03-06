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
exports.TeacherService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const company_1 = require("../entities/company");
const teacher_1 = require("../entities/teacher");
const user_1 = require("../entities/user");
const workshop_1 = require("../entities/workshop");
const typeorm_2 = require("typeorm");
let TeacherService = class TeacherService {
    constructor(teacherRepository, userRepository, companyRepository, workshopRepository) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.workshopRepository = workshopRepository;
    }
    async createTeacherRegister(phone_number, address, name) {
        try {
            const user_id = 1;
            await this.teacherRepository.save({
                user_id,
                phone_number,
                address,
                name,
            });
            return { message: '등록이 완료되었습니다.' };
        }
        catch (error) {
            console.log(error);
            return { errorMessage: '입력한 요청이 잘못되었습니다.' };
        }
    }
    async getTeacherWorkshops() {
        await this.workshopRepository.find({
            where: { deletedAt: null },
            select: ['title', 'thumb', 'genre_id'],
        });
    }
    async getTeacherMypage() {
        await this.teacherRepository.findOne({
            where: { deletedAt: null },
            select: [
                'user_id',
                'phone_number',
                'address',
                'name',
                'possession_company_id',
            ],
        });
    }
    async createTeacherCompany(company_type, company_name, business_number, rrn_front, rrn_back, bank_name, account, saving_name, isBan, user_id) {
        try {
            await this.companyRepository.insert({
                company_type,
                company_name,
                business_number,
                rrn_front,
                rrn_back,
                bank_name,
                account,
                saving_name,
                isBan,
                user_id,
            });
            if (company_name) {
                return { errorMessage: '이미 등록된 업체입니다.' };
            }
            return { message: '등록이 완료되었습니다.' };
        }
        catch (error) {
            console.log(error);
            return { errorMessage: '입력한 요청이 잘못되었습니다.' };
        }
    }
    createTeacherWorkshops(title, category, desc, thumb, min_member, max_member, total_time, price, status, location) {
    }
    getTeacherRequest() { }
    getTeacherComplete() { }
    updateTeacherAccept() { }
    updateTeacherComplete() { }
};
TeacherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(teacher_1.Teacher)),
    __param(1, (0, typeorm_1.InjectRepository)(user_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(company_1.Company)),
    __param(3, (0, typeorm_1.InjectRepository)(workshop_1.WorkShop)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TeacherService);
exports.TeacherService = TeacherService;
//# sourceMappingURL=teacher.service.js.map