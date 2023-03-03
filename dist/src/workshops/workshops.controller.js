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
exports.WorkshopsControllerRender = exports.WorkshopsController = void 0;
const common_1 = require("@nestjs/common");
let WorkshopsController = class WorkshopsController {
};
WorkshopsController = __decorate([
    (0, common_1.Controller)('workshops')
], WorkshopsController);
exports.WorkshopsController = WorkshopsController;
let WorkshopsControllerRender = class WorkshopsControllerRender {
    getMain() {
        return { data: '헬로 월드~' };
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)('main/main'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkshopsControllerRender.prototype, "getMain", null);
WorkshopsControllerRender = __decorate([
    (0, common_1.Controller)()
], WorkshopsControllerRender);
exports.WorkshopsControllerRender = WorkshopsControllerRender;
//# sourceMappingURL=workshops.controller.js.map