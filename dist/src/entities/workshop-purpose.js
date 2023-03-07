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
exports.WorkShopPurpose = void 0;
const typeorm_1 = require("typeorm");
const purpose_tag_1 = require("./purpose-tag");
const workshop_1 = require("./workshop");
let WorkShopPurpose = class WorkShopPurpose {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], WorkShopPurpose.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'workshop_id', nullable: true }),
    __metadata("design:type", Number)
], WorkShopPurpose.prototype, "workshop_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'purpose_tag_id', nullable: true }),
    __metadata("design:type", Number)
], WorkShopPurpose.prototype, "purpose_tag_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WorkShopPurpose.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WorkShopPurpose.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], WorkShopPurpose.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => workshop_1.WorkShop, (workshop) => workshop.PurposeList, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'workshop_id', referencedColumnName: 'id' }]),
    __metadata("design:type", workshop_1.WorkShop)
], WorkShopPurpose.prototype, "Workshop", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purpose_tag_1.PurposeTag, (purposeTag) => purposeTag.WorkShopPurPoseList, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'purpose_tag_id', referencedColumnName: 'id' }]),
    __metadata("design:type", purpose_tag_1.PurposeTag)
], WorkShopPurpose.prototype, "PurPoseTag", void 0);
WorkShopPurpose = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'workshop_purpose' })
], WorkShopPurpose);
exports.WorkShopPurpose = WorkShopPurpose;
//# sourceMappingURL=workshop-purpose.js.map