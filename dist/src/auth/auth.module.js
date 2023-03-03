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
const auth_render_controller_1 = require("./auth.render.controller");
const auth_controller_1 = require("./auth.controller");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_config_service_1 = require("../config/jwt.config.service");
const jwt_strategy_1 = require("./jwt/jwt.strategy");
const jwt_refreshStrategy_1 = require("./jwt/jwt.refreshStrategy");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: false }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useClass: jwt_config_service_1.JwtConfigService,
                inject: [config_1.ConfigService],
            }),
            nestjs_redis_1.RedisModule,
        ],
        controllers: [auth_controller_1.AuthController, auth_render_controller_1.AuthControllerRender],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, jwt_refreshStrategy_1.JwtRefreshStrategy],
        exports: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, jwt_refreshStrategy_1.JwtRefreshStrategy],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map