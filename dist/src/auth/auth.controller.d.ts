import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dtos/admin-login.dto';
import { AdminRegisterJoinDto } from './dtos/admin-register-join';
import { AdminRemoveDto } from './dtos/admin-remove.dto';
import { CurrentAdminDto, CurrentUserDto } from './dtos/current-user.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { RegisterJoinDto } from './dtos/register-join';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterAuthDto): Promise<boolean>;
    registerJoin(body: RegisterJoinDto, response: Response, clientIp: string): Promise<boolean>;
    login(body: LoginDto, response: Response, clientIp: string): Promise<boolean>;
    userRefreshCheck(user: CurrentUserDto, request: Request, response: Response, clientIp: string): Promise<boolean>;
    adminRegister(body: AdminRegisterJoinDto, response: Response, clientIp: string): Promise<boolean>;
    adminLogin(body: AdminLoginDto, response: Response, clientIp: string): Promise<boolean>;
    checkAdminRefresh(user: CurrentAdminDto, request: Request, response: Response, clientIp: string): Promise<boolean>;
    removeAdminAccount(body: AdminRemoveDto): Promise<boolean>;
    logOutUser(response: Response): Promise<boolean>;
    logOutAdmin(response: Response): Promise<boolean>;
    test22(user: CurrentUserDto): Promise<void>;
    test233(user: CurrentUserDto): Promise<void>;
    test66(admin: CurrentAdminDto): Promise<void>;
    test77(admin: CurrentAdminDto): Promise<void>;
}
