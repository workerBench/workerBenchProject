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
exports.TypeOrmConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin_user_1 = require("../entities/admin-user");
const company_1 = require("../entities/company");
const company_application_1 = require("../entities/company-application");
const genre_tag_1 = require("../entities/genre-tag");
const order_1 = require("../entities/order");
const purpose_tag_1 = require("../entities/purpose-tag");
const review_1 = require("../entities/review");
const review_image_1 = require("../entities/review-image");
const teacher_1 = require("../entities/teacher");
const wish_list_1 = require("../entities/wish-list");
const workshop_1 = require("../entities/workshop");
const workshop_image_1 = require("../entities/workshop-image");
const workshop_instance_detail_1 = require("../entities/workshop-instance.detail");
const workshop_purpose_1 = require("../entities/workshop-purpose");
const user_1 = require("../entities/user");
let TypeOrmConfigService = class TypeOrmConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    createTypeOrmOptions() {
        return {
            type: 'mysql',
            host: this.configService.get('DB_HOST'),
            port: this.configService.get('DB_PORT'),
            username: this.configService.get('DB_USERNAME'),
            password: this.configService.get('DB_PASSWORD'),
            database: this.configService.get('DB_NAME'),
            entities: [
                admin_user_1.AdminUser,
                company_application_1.CompanyApplication,
                company_1.company,
                genre_tag_1.GenreTag,
                order_1.Order,
                purpose_tag_1.PurposeTag,
                review_image_1.ReviewImage,
                review_1.Review,
                teacher_1.Teacher,
                user_1.User,
                wish_list_1.WishList,
                workshop_image_1.WorkShopImage,
                workshop_instance_detail_1.WorkShopInstanceDetail,
                workshop_purpose_1.WorkShopPurpose,
                workshop_1.WorkShop,
            ],
            synchronize: false,
            logging: true,
            keepConnectionAlive: true,
            charset: 'utf8mb4',
        };
    }
};
TypeOrmConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TypeOrmConfigService);
exports.TypeOrmConfigService = TypeOrmConfigService;
//# sourceMappingURL=typeorm.config.service.js.map