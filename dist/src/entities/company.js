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
exports.Company = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const company_application_1 = require("./company-application");
const teacher_1 = require("./teacher");
let Company = class Company {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Company.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '업체 종류를 선택해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: '업체 종류. 1=business, 2=freelancer',
        required: true,
    }),
    (0, typeorm_1.Column)('int', {
        name: 'company_type',
        nullable: false,
    }),
    __metadata("design:type", Number)
], Company.prototype, "company_type", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '업체 이름을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '업체 이름을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '가나다 업체',
        description: '업체 이름',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', {
        name: 'company_name',
        length: 50,
        nullable: false,
    }),
    __metadata("design:type", String)
], Company.prototype, "company_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1638437489',
        description: '사업자 법인번호. `-` 없이 입력해 주세요',
        required: false,
    }),
    (0, typeorm_1.Column)('int', { name: 'business_number', nullable: true }),
    __metadata("design:type", Number)
], Company.prototype, "business_number", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '주민번호 앞자리를 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '991203',
        description: '주민등록번호 앞자리',
        required: false,
    }),
    (0, typeorm_1.Column)('int', { name: 'rrn_front', nullable: true }),
    __metadata("design:type", Number)
], Company.prototype, "rrn_front", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '주민번호 뒷자리를 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '1234567',
        description: '주민등록번호 뒷자리',
        required: false,
    }),
    (0, typeorm_1.Column)('int', { name: 'rrn_back', nullable: true }),
    __metadata("design:type", Number)
], Company.prototype, "rrn_back", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '은행 이름을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '은행 이름을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '신한은행',
        description: '은행 이름',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', {
        name: 'bank_name',
        length: 20,
        nullable: false,
    }),
    __metadata("design:type", String)
], Company.prototype, "bank_name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        example: '110-22424-321879',
        description: '계좌 번호. `-` 없이 입력',
        required: true,
    }),
    (0, typeorm_1.Column)('int', { name: 'account', nullable: false }),
    __metadata("design:type", Number)
], Company.prototype, "account", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '예금주 성함을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '예금주 성함을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '김민수',
        description: '예금주 명',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', {
        name: 'saving_name',
        length: 20,
        nullable: false,
    }),
    __metadata("design:type", String)
], Company.prototype, "saving_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: '업체 밴 여부. defaule=0, 밴 되었을 경우 1',
        required: true,
    }),
    (0, typeorm_1.Column)('int', { name: 'isBan', nullable: false, default: 0 }),
    __metadata("design:type", Number)
], Company.prototype, "isBan", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'user_id', nullable: true }),
    __metadata("design:type", Number)
], Company.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Company.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Company.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Company.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => teacher_1.Teacher, (teacher) => teacher.MyCompany),
    (0, typeorm_1.JoinColumn)([{ name: 'user_id', referencedColumnName: 'user_id' }]),
    __metadata("design:type", teacher_1.Teacher)
], Company.prototype, "President", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => company_application_1.CompanyApplication, (companyApplication) => companyApplication.AppliedCompany),
    __metadata("design:type", Array)
], Company.prototype, "AppliedCompanyList", void 0);
Company = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'company' })
], Company);
exports.Company = Company;
//# sourceMappingURL=company.js.map