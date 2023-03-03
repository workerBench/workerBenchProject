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
exports.ReviewImage = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const common_entity_1 = require("../common/entities/common.entity");
const typeorm_1 = require("typeorm");
let ReviewImage = class ReviewImage extends common_entity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], ReviewImage.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '후기 내용을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '후기 내용을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '이번 워크샵에 참가했던 OOO 입니다. 저는 이 워크샵을 수료...',
        description: '워크샵을 수료한 학생이 리뷰를 남길 시 포함되는 글.',
        required: true,
    }),
    (0, typeorm_1.Column)('text', { name: 'content', nullable: false }),
    __metadata("design:type", String)
], ReviewImage.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '별점을 1점 이상 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '3',
        description: '별점. 3.5 등도 가능.',
        required: true,
    }),
    (0, typeorm_1.Column)('decimal', { name: 'star', nullable: false }),
    __metadata("design:type", Number)
], ReviewImage.prototype, "star", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'user_id', nullable: true }),
    __metadata("design:type", Number)
], ReviewImage.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'workshop_id', nullable: true }),
    __metadata("design:type", Number)
], ReviewImage.prototype, "workshop_id", void 0);
ReviewImage = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'review_image' })
], ReviewImage);
exports.ReviewImage = ReviewImage;
//# sourceMappingURL=review.js.map