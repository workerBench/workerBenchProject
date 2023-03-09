"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const workshop_1 = require("./src/entities/workshop");
const company_application_1 = require("./src/entities/company-application");
const company_1 = require("./src/entities/company");
const genre_tag_1 = require("./src/entities/genre-tag");
const order_1 = require("./src/entities/order");
const purpose_tag_1 = require("./src/entities/purpose-tag");
const review_image_1 = require("./src/entities/review-image");
const review_1 = require("./src/entities/review");
const teacher_1 = require("./src/entities/teacher");
const user_1 = require("./src/entities/user");
const wish_list_1 = require("./src/entities/wish-list");
const workshop_image_1 = require("./src/entities/workshop-image");
const workshop_instance_detail_1 = require("./src/entities/workshop-instance.detail");
const workshop_purpose_1 = require("./src/entities/workshop-purpose");
const admin_user_1 = require("./src/entities/admin-user");
dotenv_1.default.config();
const dataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        admin_user_1.AdminUser,
        company_application_1.CompanyApplication,
        company_1.Company,
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
    migrations: [__dirname + '/src/migrations/*.ts'],
    charset: 'utf8mb4_general_ci',
    synchronize: false,
    logging: true,
});
exports.default = dataSource;
//# sourceMappingURL=dataSource.js.map