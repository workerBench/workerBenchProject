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
exports.PurposeTag = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const workshop_purpose_1 = require("./workshop-purpose");
let PurposeTag = class PurposeTag {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], PurposeTag.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '목적 이름을 정확히 등록해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '목적 이름을 등록해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '팀 협동성',
        description: '워크샵이 어떠한 목적을 가지는가. 다수의 태그가 붙을 수 있음.',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'name', length: 20, nullable: false }),
    __metadata("design:type", String)
], PurposeTag.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PurposeTag.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PurposeTag.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], PurposeTag.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workshop_purpose_1.WorkShopPurpose, (workshopPurpose) => workshopPurpose.PurPoseTag),
    __metadata("design:type", Array)
], PurposeTag.prototype, "WorkShopPurPoseList", void 0);
PurposeTag = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'purpose_tag' })
], PurposeTag);
exports.PurposeTag = PurposeTag;
//# sourceMappingURL=purpose-tag.js.map