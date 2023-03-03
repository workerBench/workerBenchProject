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
exports.WorkShopImage = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const common_entity_1 = require("../common/entities/common.entity");
const typeorm_1 = require("typeorm");
let WorkShopImage = class WorkShopImage extends common_entity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], WorkShopImage.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '첨부한 이미지 이름을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '첨부한 이미지 이름을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '36k6hjk452jhk6.jpeg',
        description: '워크샵 상품 등록 시 첨부하는 이미지',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'img_name', length: 50, nullable: false }),
    __metadata("design:type", String)
], WorkShopImage.prototype, "img_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: '워크샵 PK',
        required: true,
    }),
    (0, typeorm_1.Column)('int', { name: 'workshop_id', nullable: true }),
    __metadata("design:type", Number)
], WorkShopImage.prototype, "workshop_id", void 0);
WorkShopImage = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'workshop_image' })
], WorkShopImage);
exports.WorkShopImage = WorkShopImage;
//# sourceMappingURL=workshop-image.js.map