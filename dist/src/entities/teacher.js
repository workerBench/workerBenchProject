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
const common_entity_1 = require("../common/entities/common.entity");
const typeorm_1 = require("typeorm");
let Teacher = class Teacher extends common_entity_1.CommonEntity {
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
    (0, typeorm_1.Column)('int', { name: 'possession_company_id', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Teacher.prototype, "possession_company_id", void 0);
Teacher = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'teacher' })
], Teacher);
exports.Teacher = Teacher;
//# sourceMappingURL=teacher.js.map