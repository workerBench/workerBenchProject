"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkshopsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_1 = require("../entities/order");
const review_1 = require("../entities/review");
const wish_list_1 = require("../entities/wish-list");
const workshop_1 = require("../entities/workshop");
const workshop_instance_detail_1 = require("../entities/workshop-instance.detail");
const workshop_repository_1 = require("./workshop.repository");
const workshops_controller_1 = require("./workshops.controller");
const workshops_render_controller_1 = require("./workshops.render.controller");
const workshops_service_1 = require("./workshops.service");
let WorkshopsModule = class WorkshopsModule {
};
WorkshopsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                workshop_1.WorkShop,
                workshop_instance_detail_1.WorkShopInstanceDetail,
                wish_list_1.WishList,
                order_1.Order,
                review_1.Review,
            ]),
        ],
        controllers: [workshops_controller_1.WorkshopsController, workshops_render_controller_1.WorkshopsControllerRender],
        providers: [workshops_service_1.WorkshopsService, workshop_repository_1.WorkshopRepository],
    })
], WorkshopsModule);
exports.WorkshopsModule = WorkshopsModule;
//# sourceMappingURL=workshops.module.js.map