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
exports.GenreTag = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let GenreTag = class GenreTag {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], GenreTag.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '장르 이름을 정확히 등록해 주세요' }),
    (0, class_validator_1.IsNotEmpty)({ message: '장르 이름을 입력해 주세요' }),
    (0, swagger_1.ApiProperty)({
        example: '문화체육',
        description: '장르, 즉 분야 이름',
        required: true,
    }),
    (0, typeorm_1.Column)('varchar', {
        name: 'name',
        length: 30,
        nullable: false,
    }),
    __metadata("design:type", String)
], GenreTag.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GenreTag.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GenreTag.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], GenreTag.prototype, "deletedAt", void 0);
GenreTag = __decorate([
    (0, typeorm_1.Entity)({ schema: 'workerbench', name: 'genre_tag' })
], GenreTag);
exports.GenreTag = GenreTag;
//# sourceMappingURL=genre-tag.js.map