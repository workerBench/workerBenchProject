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
exports.WorkShop = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const genre_tag_1 = require("./genre-tag");
const order_1 = require("./order");
const review_1 = require("./review");
const user_1 = require("./user");
const wish_list_1 = require("./wish-list");
const workshop_image_1 = require("./workshop-image");
const workshop_instance_detail_1 = require("./workshop-instance.detail");
const workshop_purpose_1 = require("./workshop-purpose");
let WorkShop = class WorkShop {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], WorkShop.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '워크샵 제목을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '팀웍 증진을 위한 워크샵',
        description: '워크샵 제목',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'title', length: 50, nullable: false }),
    __metadata("design:type", String)
], WorkShop.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '워크샵 유형을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 'online',
        description: 'online 혹은 offline',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'category', length: 50, nullable: false }),
    __metadata("design:type", String)
], WorkShop.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '워크샵에 대한 설명을 작성해 주세요.' }),
    (0, swagger_1.ApiProperty)({
        example: '이 워크샵이 만들어진 목적은....',
        description: '워크샵 상세 설명',
        required: true,
    }),
    (0, typeorm_1.Column)('text', { name: 'desc', nullable: false }),
    __metadata("design:type", String)
], WorkShop.prototype, "desc", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '썸네일 파일 이름 입력' }),
    (0, swagger_1.ApiProperty)({
        example: '342432jkl.jpg',
        description: '워크샵 썸네일 사진 파일명',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'thumb', length: 50, nullable: false }),
    __metadata("design:type", String)
], WorkShop.prototype, "thumb", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '워크샵 최소 인원을 설정해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: '워크샵 최소 인원 설정.',
        required: true,
    }),
    (0, typeorm_1.Column)('int', { name: 'min_member', nullable: false }),
    __metadata("design:type", Number)
], WorkShop.prototype, "min_member", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '워크샵 최대 인원을 설정해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: '워크샵 최대 인원 설정.',
        required: true,
    }),
    (0, typeorm_1.Column)('int', { name: 'max_member', nullable: false }),
    __metadata("design:type", Number)
], WorkShop.prototype, "max_member", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '워크샵 총 일정의 시간을 기입해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 130,
        description: '워크샵 총 과정에 소요되는 시간. 분 단위.',
        required: true,
    }),
    (0, typeorm_1.Column)('int', { name: 'total_time', nullable: false }),
    __metadata("design:type", Number)
], WorkShop.prototype, "total_time", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '워크샵 참가 인원 1인당 비용을 설정해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 45000,
        description: '워크샵 참가 인원 1인당 비용.',
        required: true,
    }),
    (0, typeorm_1.Column)('int', { name: 'price', nullable: false }),
    __metadata("design:type", Number)
], WorkShop.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'status',
        length: 50,
        nullable: false,
        default: 'request',
    }),
    __metadata("design:type", String)
], WorkShop.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '워크샵 운영이 가능한 지역을 적어주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '서울, 경기, 인천 가능합니다.',
        description: '워크샵 운영 가능 지역. 카테고리(유형) 가 offline 일 경우 함께 기입',
        required: false,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'location', length: 100, nullable: true }),
    __metadata("design:type", String)
], WorkShop.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'user_id', nullable: true }),
    __metadata("design:type", Number)
], WorkShop.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'genre_id', nullable: true }),
    __metadata("design:type", Number)
], WorkShop.prototype, "genre_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'name', nullable: true }),
    __metadata("design:type", Number)
], WorkShop.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WorkShop.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WorkShop.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], WorkShop.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, (user) => user.MyWorkshops, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'user_id', referencedColumnName: 'id' }]),
    __metadata("design:type", user_1.User)
], WorkShop.prototype, "Owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workshop_instance_detail_1.WorkShopInstanceDetail, (workShopInstanceDetail) => workShopInstanceDetail.Workshop),
    __metadata("design:type", Array)
], WorkShop.prototype, "WorkShopInstances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_1.Review, (review) => review.Workshop),
    __metadata("design:type", Array)
], WorkShop.prototype, "Reviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_1.Order, (order) => order.Workshop),
    __metadata("design:type", Array)
], WorkShop.prototype, "Orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workshop_image_1.WorkShopImage, (workshopImage) => workshopImage.Workshop),
    __metadata("design:type", Array)
], WorkShop.prototype, "Images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wish_list_1.WishList, (wishList) => wishList.Workshop),
    __metadata("design:type", Array)
], WorkShop.prototype, "WishList", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => genre_tag_1.GenreTag, (genreTag) => genreTag.WorkShopList, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'genre_id', referencedColumnName: 'id' }]),
    __metadata("design:type", genre_tag_1.GenreTag)
], WorkShop.prototype, "GenreTag", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workshop_purpose_1.WorkShopPurpose, (workshopPurpose) => workshopPurpose.Workshop),
    __metadata("design:type", Array)
], WorkShop.prototype, "PurposeList", void 0);
WorkShop = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'workshop' })
], WorkShop);
exports.WorkShop = WorkShop;
//# sourceMappingURL=workshop.js.map