import { RedisOptionsFactory, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
export declare class RedisConfigService implements RedisOptionsFactory {
    private configService;
    constructor(configService: ConfigService);
    createRedisOptions(): Promise<RedisModuleOptions>;
}
