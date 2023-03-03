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
exports.CompanyApplication = void 0;
const typeorm_1 = require("typeorm");
let CompanyApplication = class CompanyApplication {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], CompanyApplication.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'teacher_id', nullable: true }),
    __metadata("design:type", Number)
], CompanyApplication.prototype, "teacher_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'company_id', nullable: true }),
    __metadata("design:type", Number)
], CompanyApplication.prototype, "company_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CompanyApplication.prototype, "createdAt", void 0);
CompanyApplication = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'company_application' })
], CompanyApplication);
exports.CompanyApplication = CompanyApplication;
//# sourceMappingURL=company-application.js.map