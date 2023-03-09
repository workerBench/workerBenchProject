"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MypageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mypage_controller_1 = require("./mypage.controller");
const mypage_service_1 = require("./mypage.service");
const review_1 = require("../entities/review");
const review_image_1 = require("../entities/review-image");
const wish_list_1 = require("../entities/wish-list");
const review_repository_1 = require("./review.repository");
const review_image_repository_1 = require("./review-image.repository");
const mypage_render_controller_1 = require("./mypage.render.controller");
let MypageModule = class MypageModule {
};
MypageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                review_1.Review,
                review_image_1.ReviewImage,
                wish_list_1.WishList,
            ]),
        ],
        controllers: [mypage_controller_1.MypageController, mypage_render_controller_1.MypageControllerRender],
        providers: [mypage_service_1.MypageService, review_repository_1.ReviewRepository, review_image_repository_1.ReviewImageRepository],
    })
], MypageModule);
exports.MypageModule = MypageModule;
//# sourceMappingURL=mypage.module.js.map