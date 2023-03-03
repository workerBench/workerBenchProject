"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRefreshAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let JwtRefreshAuthGuard = class JwtRefreshAuthGuard extends (0, passport_1.AuthGuard)('refreshToken') {
    canActivate(context) {
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        console.log('32312321');
        console.log(user);
        if (err || !user) {
            console.log('여긴 리프레쉬 가드!');
            throw new common_1.UnauthorizedException('인증 문제가 있습니다.');
        }
        return user;
    }
};
JwtRefreshAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtRefreshAuthGuard);
exports.JwtRefreshAuthGuard = JwtRefreshAuthGuard;
//# sourceMappingURL=jwt.refreshGuard.js.map