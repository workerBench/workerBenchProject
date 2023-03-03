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
const common_entity_1 = require("../common/entities/common.entity");
const typeorm_1 = require("typeorm");
let WorkShopPurpose = class WorkShopPurpose extends common_entity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], WorkShopPurpose.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'workshop_id', nullable: false }),
    __metadata("design:type", Number)
], WorkShopPurpose.prototype, "workshop_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'purpose_tag_id', nullable: false }),
    __metadata("design:type", Number)
], WorkShopPurpose.prototype, "purpose_tag_id", void 0);
WorkShopPurpose = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'workshop_purpose' })
], WorkShopPurpose);
exports.WorkShopPurpose = WorkShopPurpose;
//# sourceMappingURL=workshop-purpose.js.map