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
exports.WorkShopInstanceDetail = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const workshop_1 = require("./workshop");
let WorkShopInstanceDetail = class WorkShopInstanceDetail {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], WorkShopInstanceDetail.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '단체명을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '단체명을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '가나다 회사',
        description: '워크샵을 신청하는 회사 혹은 단체',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'company', length: 50, nullable: false }),
    __metadata("design:type", String)
], WorkShopInstanceDetail.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '신청자의 성함을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '신청자의 성함을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '김민수',
        description: '신청자 이름',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'name', length: 20, nullable: false }),
    __metadata("design:type", String)
], WorkShopInstanceDetail.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)({ message: '이메일을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '이메일을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 'lololo@efj.com',
        description: '워크샵 수강 문의를 제출한 유저의 이메일',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', {
        name: 'email',
        length: 50,
        nullable: false,
    }),
    __metadata("design:type", String)
], WorkShopInstanceDetail.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '전화번호를 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '전화번호를 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '01022224444',
        description: '수강 문의 신청자의 전화번호. `-` 제외',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'phone_number', length: 50, nullable: false }),
    __metadata("design:type", String)
], WorkShopInstanceDetail.prototype, "phone_number", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '희망하는 날짜를 정확히 선택해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '희망하는 날짜를 선택해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '2023-03-10',
        description: '희망하는 워크샵 수강일',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'wish_date', length: 50, nullable: false }),
    __metadata("design:type", String)
], WorkShopInstanceDetail.prototype, "wish_date", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'status',
        length: 20,
        nullable: false,
        default: 'request',
    }),
    __metadata("design:type", String)
], WorkShopInstanceDetail.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '워크샵을 희망하시는 이유를 적어주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '안녕하세요 전....',
        description: '워크샵을 통해 이루고자 하는 바',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'purpose', length: 200, nullable: false }),
    __metadata("design:type", String)
], WorkShopInstanceDetail.prototype, "purpose", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '원하시는 워크샵 수행 위치를 기입해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '서울시 종로구 OO',
        description: '워크샵을 희망하는 위치. 단, 워크샵 유형이 오프라인일 경우.',
        required: false,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'wish_location', length: 100, nullable: true }),
    __metadata("design:type", String)
], WorkShopInstanceDetail.prototype, "wish_location", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '희망하시는 인원을 적어 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 20,
        description: '워크샵에 참가하길 희망하는 총 인원',
        required: true,
    }),
    (0, typeorm_1.Column)('int', { name: 'member_cnt', nullable: false }),
    __metadata("design:type", Number)
], WorkShopInstanceDetail.prototype, "member_cnt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: '기타 문의사항은 다음과 같습니다...',
        description: '워크샵 수강 문의 등록 시 기타 문의 사항 기록',
        required: false,
    }),
    (0, typeorm_1.Column)('text', { name: 'etc', nullable: true }),
    __metadata("design:type", String)
], WorkShopInstanceDetail.prototype, "etc", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'online, offline 둘 중 하나를 택해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 'online',
        description: '워크샵 수강 문의 등록 시 신쳥 유형이 오프라인인지 온라인인지 명시',
        required: false,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'category', length: 100, nullable: false }),
    __metadata("design:type", String)
], WorkShopInstanceDetail.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'user_id', nullable: true }),
    __metadata("design:type", Number)
], WorkShopInstanceDetail.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'workshop_id', nullable: true }),
    __metadata("design:type", Number)
], WorkShopInstanceDetail.prototype, "workshop_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WorkShopInstanceDetail.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WorkShopInstanceDetail.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], WorkShopInstanceDetail.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, (user) => user.MyInstances, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'user_id', referencedColumnName: 'id' }]),
    __metadata("design:type", user_1.User)
], WorkShopInstanceDetail.prototype, "Writer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => workshop_1.WorkShop, (workshop) => workshop.WorkShopInstances, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'workshop_id', referencedColumnName: 'id' }]),
    __metadata("design:type", user_1.User)
], WorkShopInstanceDetail.prototype, "Workshop", void 0);
WorkShopInstanceDetail = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'workshop_instance_detail' })
], WorkShopInstanceDetail);
exports.WorkShopInstanceDetail = WorkShopInstanceDetail;
//# sourceMappingURL=workshop-instance.detail.js.map