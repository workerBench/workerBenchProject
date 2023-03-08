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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lodash_1 = __importDefault(require("lodash"));
const teacher_1 = require("../entities/teacher");
const user_1 = require("../entities/user");
const workshop_1 = require("../entities/workshop");
const typeorm_2 = require("typeorm");
let TeacherService = class TeacherService {
    constructor(teacherRepository, userRepository, workshopRepository, companyRepository, genreTagRepository) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
        this.workshopRepository = workshopRepository;
        this.companyRepository = companyRepository;
        this.genreTagRepository = genreTagRepository;
    }
    async createTeacherRegister(user_id, phone_number, address, name) {
        try {
            const User_id = await this.teacherRepository.findOne({
                where: { user_id }
            });
            if (User_id) {
                throw new common_1.UnauthorizedException('이미 등록된 강사입니다.');
            }
            this.teacherRepository.insert({
                user_id: user_id,
                phone_number,
                address,
                name,
            });
            if (user_id) {
                return { errorMessage: '이미 등록된 강사입니다.' };
            }
            return { message: '등록이 완료되었습니다.' };
        }
        catch (error) {
            console.log(error);
            throw new error('입력된 요청이 잘못되었습니다.');
        }
    }
    async getTeacherWorkshops() {
        try {
            const workshop = await this.workshopRepository.find({
                where: { deletedAt: null },
                select: ['title', 'thumb', 'genre_id'],
            });
            return workshop;
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException('입력된 요청이 잘못되었습니다.');
        }
    }
    async getTeacherMypage() {
        return this.companyRepository
            .createQueryBuilder('company')
            .leftJoinAndSelect('company.User', 'user')
            .select([
            'company.id',
            'company.company_type',
            'company.company_name',
            'company.business_number',
            'company.rrn_front',
            'company.rrn_back',
            'company.bank_name',
            'company.account',
            'company.saving_name',
            'user.phone_number',
            'user.address',
            'user.name',
        ])
            .getMany();
    }
    async createTeacherCompany(company_type, company_name, business_number, rrn_front, rrn_back, bank_name, account, saving_name, isBan, user_id) {
        try {
            await this.teacherRepository.findOne({
                where: { user_id }
            });
            this.companyRepository.insert({
                company_type,
                company_name,
                business_number,
                rrn_front,
                rrn_back,
                bank_name,
                account,
                saving_name,
                isBan,
                user_id: user_id
            });
            return { message: '등록이 완료되었습니다.' };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async createTeacherWorkshops(category, genre_id, title, desc, thumb, min_member, max_member, total_time, price, location) {
        try {
            await this.workshopRepository.insert({
                category,
                genre_id,
                title,
                desc,
                thumb,
                min_member,
                max_member,
                total_time,
                price,
                status: "request",
                location,
            });
            return {
                message: '워크샵 등록 신청이 완료되었습니다. 관리자의 수락을 기다려 주세요',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException('입력된 요청이 잘못되었습니다.');
        }
    }
    async getTeacherRequest() {
        const request = await this.workshopRepository.find({
            where: { status: 'request' },
        });
        return request;
    }
    async getTeacherComplete() {
        const complete = await this.workshopRepository.find({
            where: { status: 'approval' },
        });
        return complete;
    }
    async updateTeacherAccept(id) {
        try {
            const status = await this.workshopRepository.findOne({
                where: { id },
                select: ['status']
            });
            if (!status || lodash_1.default.isNil(status)) {
                throw new common_1.NotFoundException('등록된 워크샵이 없습니다.');
            }
            await this.workshopRepository.update(id, { status: "approval" });
            if (status.status !== "approval") {
                throw new common_1.UnauthorizedException('이미 워크샵이 수락되었습니다.');
            }
            return { message: '워크샵이 수락 되었습니다.' };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException('입력된 요청이 잘못되었습니다.');
        }
    }
    async updateTeacherComplete(id) {
        try {
            const status = await this.workshopRepository.findOne({
                where: { id },
                select: ['status']
            });
            if (!status || lodash_1.default.isNil(status)) {
                throw new common_1.NotFoundException('등록된 워크샵이 없습니다.');
            }
            await this.workshopRepository.update(id, { status: "finished" });
            if (status.status !== "finished") {
                throw new common_1.UnauthorizedException('이미 워크샵이 종료되었습니다.');
            }
            return { message: '워크샵이 종료 되었습니다.' };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException('입력된 요청이 잘못되었습니다.');
        }
    }
};
TeacherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(teacher_1.Teacher)),
    __param(1, (0, typeorm_1.InjectRepository)(user_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(workshop_1.WorkShop)),
    __param(3, (0, typeorm_1.InjectRepository)(user_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(user_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TeacherService);
exports.TeacherService = TeacherService;
//# sourceMappingURL=teacher.service.js.map