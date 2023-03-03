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
exports.Order = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const common_entity_1 = require("../common/entities/common.entity");
const typeorm_1 = require("typeorm");
let Order = class Order extends common_entity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '결제 고유번호를 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '결제 고유번호를 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '1643289-4284937',
        description: '외부 API 를 통해 결제를 하였을 경우 얻을 수 있는 결제 고유 번호',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'imp_uid', length: 100, nullable: false }),
    __metadata("design:type", String)
], Order.prototype, "imp_uid", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '결제된 금액을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '39800',
        description: '실제로 결제된 금액',
        required: true,
    }),
    (0, typeorm_1.Column)('int', { name: 'amount', nullable: false }),
    __metadata("design:type", Number)
], Order.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '결제 시 이용한 방법을 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '결제 시 이용한 방법을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 'card',
        description: '실제로 결제에 사용한 수단',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'pay_method', length: 50, nullable: false }),
    __metadata("design:type", String)
], Order.prototype, "pay_method", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '결제 상태를 정확히 입력해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '결제 상태를 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: 'paid',
        description: '최종적으로 금액이 지불되었는가 여부',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', { name: 'status', length: 20, nullable: false }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'user_id', nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'workshop_id', nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "workshop_id", void 0);
Order = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'order' })
], Order);
exports.Order = Order;
//# sourceMappingURL=order.js.map