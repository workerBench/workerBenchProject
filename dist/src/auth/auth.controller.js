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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_real_ip_1 = require("nestjs-real-ip");
const user_decorator_1 = require("../common/decorators/user.decorator");
const success_interceptor_1 = require("../common/interceptors/success.interceptor");
const auth_service_1 = require("./auth.service");
const admin_login_dto_1 = require("./dtos/admin-login.dto");
const admin_register_join_1 = require("./dtos/admin-register-join");
const admin_remove_dto_1 = require("./dtos/admin-remove.dto");
const current_user_dto_1 = require("./dtos/current-user.dto");
const login_dto_1 = require("./dtos/login.dto");
const register_auth_dto_1 = require("./dtos/register-auth.dto");
const register_join_1 = require("./dtos/register-join");
const jwt_normal_admin_guard_1 = require("./jwt/access/admin/jwt-normal-admin-guard");
const jwt_super_admin_guard_1 = require("./jwt/access/admin/jwt-super-admin-guard");
const jwt_teacher_guard_1 = require("./jwt/access/user/jwt-teacher-guard");
const jwt_user_guard_1 = require("./jwt/access/user/jwt-user-guard");
const jwt_admin_refresh_guard_1 = require("./jwt/refresh/admin/jwt-admin-refresh-guard");
const jwt_user_refresh_guard_1 = require("./jwt/refresh/user/jwt-user-refresh-guard");
const token_name_1 = require("./naming/token-name");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(body) {
        try {
            await this.authService.checkEffective(body);
            await this.authService.checkingAccount(body.email);
            await this.authService.sendingEmailAuthCode(body.email);
            return true;
        }
        catch (err) {
            throw new common_1.HttpException(`${err.message}`, 401);
        }
    }
    async registerJoin(body, response, clientIp) {
        const { email, password, emailAuthCode } = body;
        try {
            await this.authService.checkingEmailCode(email, emailAuthCode);
            const createdUser = await this.authService.joinUser(email, password);
            const accessToken = await this.authService.makeAccessToken(createdUser.id, createdUser.email, createdUser.user_type);
            const refreshToken = await this.authService.makeRefreshToken(createdUser.id, createdUser.email, createdUser.user_type, clientIp);
            response.cookie(token_name_1.TOKEN_NAME.userAccess, accessToken, { httpOnly: true });
            response.cookie(token_name_1.TOKEN_NAME.userRefresh, refreshToken, { httpOnly: true });
            return true;
        }
        catch (err) {
            throw new common_1.BadRequestException(`${err.message}`);
        }
    }
    async login(body, response, clientIp) {
        const { email, password } = body;
        let userInfo;
        try {
            userInfo = await this.authService.checkLoginUser(email, password);
        }
        catch (err) {
            throw new common_1.BadRequestException(`${err.message}`);
        }
        const accessToken = await this.authService.makeAccessToken(userInfo.id, userInfo.email, userInfo.user_type);
        const refreshToken = await this.authService.makeRefreshToken(userInfo.id, userInfo.email, userInfo.user_type, clientIp);
        response.cookie(token_name_1.TOKEN_NAME.userAccess, accessToken, { httpOnly: true });
        response.cookie(token_name_1.TOKEN_NAME.userRefresh, refreshToken, { httpOnly: true });
        return true;
    }
    async userRefreshCheck(user, request, response, clientIp) {
        try {
            const refreshToken = request.cookies[token_name_1.TOKEN_NAME.userRefresh];
            await this.authService.checkRefreshTokenInRedis(user.id, user.user_type, clientIp, refreshToken);
            const accessToken = await this.authService.makeAccessToken(user.id, user.email, user.user_type);
            response.cookie(token_name_1.TOKEN_NAME.userAccess, accessToken, { httpOnly: true });
            return true;
        }
        catch (err) {
            response.clearCookie(token_name_1.TOKEN_NAME.userAccess);
            response.clearCookie(token_name_1.TOKEN_NAME.userRefresh);
            throw new common_1.HttpException(`${err.message}`, 400);
        }
    }
    async adminRegister(body, response, clientIp) {
        try {
            await this.authService.checkEffectiveForAdmin(body);
            await this.authService.checkingAdminAccount(body.email);
            const createdAdminUser = await this.authService.joinAdminUser(body);
            const accessToken = await this.authService.makeAccessTokenForAdmin(createdAdminUser.id, createdAdminUser.email, createdAdminUser.admin_type);
            const refreshToken = await this.authService.makeRefreshTokenForAdmin(createdAdminUser.id, createdAdminUser.email, createdAdminUser.admin_type, clientIp);
            response.cookie(token_name_1.TOKEN_NAME.adminAccess, accessToken, { httpOnly: true });
            response.cookie(token_name_1.TOKEN_NAME.adminRefresh, refreshToken, {
                httpOnly: true,
            });
            return true;
        }
        catch (err) {
            throw new common_1.HttpException(`${err.message}`, 401);
        }
    }
    async adminLogin(body, response, clientIp) {
        const { email, password } = body;
        let adminInfo;
        try {
            adminInfo = await this.authService.checkLoginAdminUser(email, password);
        }
        catch (err) {
            throw new common_1.BadRequestException(`${err.message}`);
        }
        const accessToken = await this.authService.makeAccessTokenForAdmin(adminInfo.id, adminInfo.email, adminInfo.admin_type);
        const refreshToken = await this.authService.makeRefreshTokenForAdmin(adminInfo.id, adminInfo.email, adminInfo.admin_type, clientIp);
        response.cookie(token_name_1.TOKEN_NAME.adminAccess, accessToken, { httpOnly: true });
        response.cookie(token_name_1.TOKEN_NAME.adminRefresh, refreshToken, { httpOnly: true });
        return true;
    }
    async checkAdminRefresh(user, request, response, clientIp) {
        try {
            const refreshToken = request.cookies[token_name_1.TOKEN_NAME.adminRefresh];
            await this.authService.checkAdminRefreshTokenInRedis(user.id, user.admin_type, clientIp, refreshToken);
            const accessToken = await this.authService.makeAccessTokenForAdmin(user.id, user.email, user.admin_type);
            response.cookie(token_name_1.TOKEN_NAME.adminAccess, accessToken, { httpOnly: true });
            return true;
        }
        catch (err) {
            response.clearCookie(token_name_1.TOKEN_NAME.adminAccess);
            response.clearCookie(token_name_1.TOKEN_NAME.adminRefresh);
            throw new common_1.HttpException(`${err.message}`, 400);
        }
    }
    async removeAdminAccount(body) {
        return await this.authService.removeAdmin(body.email);
    }
    async logOutUser(response) {
        response.clearCookie(token_name_1.TOKEN_NAME.userAccess);
        response.clearCookie(token_name_1.TOKEN_NAME.userRefresh);
        return true;
    }
    async logOutAdmin(response) {
        response.clearCookie(token_name_1.TOKEN_NAME.adminAccess);
        response.clearCookie(token_name_1.TOKEN_NAME.adminRefresh);
        return true;
    }
    async test22(user) {
        console.log('---- 테스트 잘 작동함!');
        console.log(user);
        return;
    }
    async test233(user) {
        console.log('---- 테스트 잘 작동함!');
        console.log(user.id);
        return;
    }
    async test66(user) {
        console.log('부 관리자 테스트!');
        console.log(user);
    }
    async test77(user) {
        console.log('최고 관리자 테스트!');
        console.log(user);
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공',
    }),
    (0, swagger_1.ApiOperation)({ summary: '회원가입 - 인증 api' }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_auth_dto_1.RegisterAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공',
        type: Boolean,
    }),
    (0, swagger_1.ApiOperation)({ summary: '회원가입 - join api' }),
    (0, common_1.Post)('register/join'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, nestjs_real_ip_1.RealIP)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_join_1.RegisterJoinDto, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerJoin", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공',
        type: register_join_1.RegisterJoinDto,
    }),
    (0, swagger_1.ApiOperation)({ summary: '로그인 api' }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, nestjs_real_ip_1.RealIP)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'refresh token 이 유효하다면 access token 을 재발급',
    }),
    (0, common_1.Get)('refreshtoken/user'),
    (0, common_1.UseGuards)(jwt_user_refresh_guard_1.JwtRefreshAuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __param(3, (0, nestjs_real_ip_1.RealIP)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [current_user_dto_1.CurrentUserDto, Object, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "userRefreshCheck", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공',
    }),
    (0, swagger_1.ApiOperation)({ summary: '관리자 등록' }),
    (0, common_1.Post)('admin/register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, nestjs_real_ip_1.RealIP)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_register_join_1.AdminRegisterJoinDto, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminRegister", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공',
        type: admin_login_dto_1.AdminLoginDto,
    }),
    (0, swagger_1.ApiOperation)({ summary: '관리자 로그인 api' }),
    (0, common_1.Post)('admin/login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, nestjs_real_ip_1.RealIP)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.AdminLoginDto, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'refresh token 이 유효하다면 access token 을 재발급',
    }),
    (0, common_1.Get)('refreshtoken/admin'),
    (0, common_1.UseGuards)(jwt_admin_refresh_guard_1.JwtAdminRefreshAuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __param(3, (0, nestjs_real_ip_1.RealIP)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [current_user_dto_1.CurrentAdminDto, Object, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkAdminRefresh", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공',
        type: admin_remove_dto_1.AdminRemoveDto,
    }),
    (0, swagger_1.ApiOperation)({ summary: '관리자 삭제' }),
    (0, common_1.Post)('admin/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_remove_dto_1.AdminRemoveDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "removeAdminAccount", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공',
    }),
    (0, swagger_1.ApiOperation)({ summary: '유저 로그아웃 api' }),
    (0, common_1.Post)('logout/user'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logOutUser", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공',
    }),
    (0, swagger_1.ApiOperation)({ summary: '관리자 로그아웃 api' }),
    (0, common_1.Post)('logout/admin'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logOutAdmin", null);
__decorate([
    (0, common_1.Get)('test'),
    (0, common_1.UseGuards)(jwt_user_guard_1.JwtUserAuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [current_user_dto_1.CurrentUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "test22", null);
__decorate([
    (0, common_1.Get)('test2'),
    (0, common_1.UseGuards)(jwt_teacher_guard_1.JwtTeacherAuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [current_user_dto_1.CurrentUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "test233", null);
__decorate([
    (0, common_1.Get)('admintest'),
    (0, common_1.UseGuards)(jwt_normal_admin_guard_1.JwtNormalAdminAuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [current_user_dto_1.CurrentUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "test66", null);
__decorate([
    (0, common_1.Get)('superadmintest'),
    (0, common_1.UseGuards)(jwt_super_admin_guard_1.JwtSuperAdminAuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [current_user_dto_1.CurrentUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "test77", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.UseInterceptors)(success_interceptor_1.SuccessInterceptor),
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map