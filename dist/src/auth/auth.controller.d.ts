import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CurrentUserDto } from './dtos/current-user.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { RegisterJoinDto } from './dtos/register-join';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterAuthDto): Promise<boolean>;
    registerJoin(body: RegisterJoinDto, response: Response, clientIp: string): Promise<boolean>;
    login(body: LoginDto, response: Response, clientIp: string): Promise<boolean>;
    test22(user: CurrentUserDto): Promise<void>;
    test233(user: CurrentUserDto): Promise<void>;
    test44(user: CurrentUserDto, request: Request, response: Response, clientIp: string): Promise<boolean>;
}
