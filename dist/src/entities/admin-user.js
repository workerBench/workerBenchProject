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
exports.AdminUser = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const common_entity_1 = require("../common/entities/common.entity");
const typeorm_1 = require("typeorm");
let AdminUser = class AdminUser extends common_entity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], AdminUser.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)({ message: '이메일을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '이메일을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 'lololo@efj.com',
        description: '관리자 이메일',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', {
        name: 'email',
        unique: true,
        length: 50,
        nullable: false,
    }),
    __metadata("design:type", String)
], AdminUser.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, class_validator_1.IsString)({ message: '비밀번호를 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '비밀번호를 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '12345',
        description: 'password',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', {
        name: 'password',
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], AdminUser.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '이름을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '이름을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '김민수',
        description: 'name',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'name', length: 20, nullable: false }),
    __metadata("design:type", String)
], AdminUser.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '전화번호를 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '전화번호를 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '01022223333',
        description: '전화번호',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'phone_number', length: 50, nullable: false }),
    __metadata("design:type", String)
], AdminUser.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'admin_type',
        length: 20,
        nullable: true,
        default: 'normal_admin',
    }),
    __metadata("design:type", String)
], AdminUser.prototype, "admin_type", void 0);
AdminUser = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'admin_user' })
], AdminUser);
exports.AdminUser = AdminUser;
//# sourceMappingURL=admin-user.js.map