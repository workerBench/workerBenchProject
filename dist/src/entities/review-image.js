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
const typeorm_1 = require("typeorm");
const review_1 = require("./review");
let ReviewImage = class ReviewImage {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], ReviewImage.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '첨부한 이미지 이름을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '첨부한 이미지 이름을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '36k6hjk452jhk6.jpeg',
        description: '워크샵을 수강 완료한 학생이 해당 워크샵에 후기를 남길 때 이미지를 첨부하는 경우 입력됨.',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'img_name', length: 50, nullable: false }),
    __metadata("design:type", String)
], ReviewImage.prototype, "img_name", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'review_id', nullable: true }),
    __metadata("design:type", Number)
], ReviewImage.prototype, "review_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReviewImage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ReviewImage.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], ReviewImage.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => review_1.Review, (reivew) => reivew.ReviewImages, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'review_id', referencedColumnName: 'id' }]),
    __metadata("design:type", review_1.Review)
], ReviewImage.prototype, "Review", void 0);
ReviewImage = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'review_image' })
], ReviewImage);
exports.ReviewImage = ReviewImage;
//# sourceMappingURL=review-image.js.map