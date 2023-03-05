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
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const jwtExtractorFromCookies_1 = require("../../common/utils/jwtExtractorFromCookies");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(authService, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([jwtExtractorFromCookies_1.jwtUserTokenFromCookie]),
            secretOrKey: configService.get('JWT_SECRET_KEY'),
            ignoreExpiration: false,
        });
        this.authService = authService;
        this.configService = configService;
    }
    async validate(payload) {
        try {
            console.log('문제가 없다면 스트레트지로.');
            console.log(payload);
            console.log(this.tokenFromCookie);
            console.log('------');
            return { email: 'test', payload };
        }
        catch (error) {
            console.log('스트레트지 에러');
            throw new common_1.UnauthorizedException(error);
        }
    }
};
JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map