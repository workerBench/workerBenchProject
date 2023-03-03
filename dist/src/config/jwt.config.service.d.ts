import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
export declare class JwtConfigService implements JwtOptionsFactory {
    private readonly configService;
    constructor(configService: ConfigService);
    createJwtOptions(): JwtModuleOptions;
}
