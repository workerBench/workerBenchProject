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
exports.AuthService = void 0;
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(jwtService, configService, redisService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.redisService = redisService;
        this.redisClient = redisService.getClient();
    }
    async verifyUserAndSignJwtAccess() {
        const user_id = 1;
        const accessJwt = await this.jwtService.signAsync({ user_id: user_id }, { secret: this.configService.get('JWT_SECRET_KEY'), expiresIn: '20s' });
        return accessJwt;
    }
    async verifyUserAndSignJwtRefresh() {
        const refreshJwt = await this.jwtService.signAsync({ user_id: 'refresh_test' }, { secret: this.configService.get('JWT_SECRET_KEY'), expiresIn: '200s' });
        this.redisClient.setex('refresh_test', 200, refreshJwt);
        return refreshJwt;
    }
    async getRefreshTokenFromRedis() {
        return this.redisClient.get('refresh_test');
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        nestjs_redis_1.RedisService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map