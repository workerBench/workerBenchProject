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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teacher = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const company_1 = require("./company");
const company_application_1 = require("./company-application");
const user_1 = require("./user");
let Teacher = class Teacher {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)('int', { name: 'user_id' }),
    __metadata("design:type", Number)
], Teacher.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '전화번호를 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '전화번호를 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '01022224444',
        description: '강사 전화번호. `-` 제외',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'phone_number', length: 50, nullable: false }),
    __metadata("design:type", String)
], Teacher.prototype, "phone_number", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '주소를 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '주소를 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '서울시 종로구',
        description: '강사 실거주 주소',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'address', length: 100, nullable: false }),
    __metadata("design:type", String)
], Teacher.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '성함을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '성함을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '김하하',
        description: '강사 실명',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'name', length: 30, nullable: false }),
    __metadata("design:type", String)
], Teacher.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'affiliation_company_id', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Teacher.prototype, "affiliation_company_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Teacher.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Teacher.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Teacher.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_1.User, (user) => user.TeacherProfile),
    (0, typeorm_1.JoinColumn)([{ name: 'user_id', referencedColumnName: 'id' }]),
    __metadata("design:type", user_1.User)
], Teacher.prototype, "User", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => company_1.Company, (company) => company.President),
    __metadata("design:type", company_1.Company)
], Teacher.prototype, "MyCompany", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => company_application_1.CompanyApplication, (companyApplication) => companyApplication.Teacher),
    __metadata("design:type", Array)
], Teacher.prototype, "ApplicationList", void 0);
Teacher = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'teacher' })
], Teacher);
exports.Teacher = Teacher;
//# sourceMappingURL=teacher.js.map