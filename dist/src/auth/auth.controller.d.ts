import { Response } from 'express';
import { AuthService } from './auth.service';
import { loginDTO } from './dtos/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: loginDTO, response: Response): Promise<{
        accessJwt: string;
        refreshJwt: string;
    }>;
    checkAccessToken(user: any): Promise<{
        success: boolean;
        user: any;
    }>;
    refreshToken(): Promise<void>;
    getReFresh(): Promise<string>;
}
