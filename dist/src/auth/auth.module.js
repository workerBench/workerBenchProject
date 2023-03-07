"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_config_service_1 = require("../config/jwt.config.service");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const auth_controller_1 = require("./auth.controller");
const auth_render_controller_1 = require("./auth.render.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_1 = require("../entities/user");
const admin_user_1 = require("../entities/admin-user");
const mailer_1 = require("@nestjs-modules/mailer");
const nodemailer_service_1 = require("../config/nodemailer.service");
const jwt_user_strategy_1 = require("./jwt/access/user/jwt-user.strategy");
const jwt_user_refresh_strategy_1 = require("./jwt/refresh/user/jwt-user-refresh.strategy");
const jwt_admin_strategy_1 = require("./jwt/access/admin/jwt-admin.strategy");
const jwt_admin_refresh_strategy_1 = require("./jwt/refresh/admin/jwt-admin-refresh.strategy");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({
                defaultStrategy: [
                    'userAccessToken',
                    'refreshToken',
                    'adminAccessToken',
                    'adminRefreshToken',
                ],
                session: false,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_1.User, admin_user_1.AdminUser]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useClass: jwt_config_service_1.JwtConfigService,
                inject: [config_1.ConfigService],
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: nodemailer_service_1.nodeMailerOption,
            }),
            nestjs_redis_1.RedisModule,
            config_1.ConfigModule.forRoot(),
        ],
        controllers: [auth_controller_1.AuthController, auth_render_controller_1.AuthControllerRender],
        providers: [
            auth_service_1.AuthService,
            jwt_user_strategy_1.JwtUserStrategy,
            jwt_user_refresh_strategy_1.JwtRefreshStrategy,
            jwt_admin_strategy_1.JwtAdminStrategy,
            jwt_admin_refresh_strategy_1.JwtAdminRefreshStrategy,
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map