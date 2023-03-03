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
exports.User = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const common_entity_1 = require("../common/entities/common.entity");
const typeorm_1 = require("typeorm");
let User = class User extends common_entity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)({ message: '이메일을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '이메일을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 'lololo@efj.com',
        description: '유저 이메일',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', {
        name: 'email',
        unique: true,
        length: 50,
        nullable: false,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
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
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: '해당 유저의 강사 등록 여부. default=0, 강사 등록 시 1',
        required: false,
    }),
    (0, typeorm_1.Column)('int', {
        name: 'user_type',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], User.prototype, "user_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: '업체 밴 여부. defaule=0, 밴 되었을 경우 1',
        required: true,
    }),
    (0, typeorm_1.Column)('int', { name: 'isBan', nullable: false, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "isBan", void 0);
User = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'user' })
], User);
exports.User = User;
//# sourceMappingURL=user.js.map