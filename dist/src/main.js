"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const swagger_1 = require("@nestjs/swagger");
const passport_1 = __importDefault(require("passport"));
const http_api_exception_filter_1 = require("./common/exceptions/http.api.exception.filter");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = require("path");
class Application {
    constructor(server) {
        this.server = server;
        this.logger = new common_1.Logger(Application.name);
        this.server = server;
        if (!process.env.JWT_SECRET_KEY)
            this.logger.error('Set "SECRET" env');
        this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true;
        this.PORT = process.env.PORT || '5000';
        this.corsOriginList = process.env.CORS_ORIGIN_LIST
            ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
            : ['*'];
        this.ADMIN_USER = process.env.ADMIN_USER || 'msdou';
        this.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12345';
    }
    setUpBasicAuth() {
        this.server.use(['/docs', '/docs-json'], (0, express_basic_auth_1.default)({
            challenge: true,
            users: {
                [this.ADMIN_USER]: this.ADMIN_PASSWORD,
            },
        }));
    }
    setUpOpenAPIMidleware() {
        swagger_1.SwaggerModule.setup('/docs', this.server, swagger_1.SwaggerModule.createDocument(this.server, new swagger_1.DocumentBuilder()
            .setTitle('workerbench - API')
            .setDescription('TypeORM In Nest')
            .setVersion('0.0.1')
            .build()));
    }
    async setUpGlobalMiddleware() {
        this.server.enableCors({
            origin: this.corsOriginList,
            credentials: true,
        });
        this.server.use((0, cookie_parser_1.default)());
        this.setUpBasicAuth();
        this.setUpOpenAPIMidleware();
        this.server.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        this.server.use(passport_1.default.initialize());
        this.server.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(this.server.get(core_1.Reflector)));
        this.server.useGlobalFilters(new http_api_exception_filter_1.HttpApiExceptionFilter());
        this.server.useStaticAssets((0, path_1.join)(__dirname, '..', '..', 'public'));
        this.server.setBaseViewsDir((0, path_1.join)(__dirname, '..', '..', 'views'));
        this.server.setViewEngine('ejs');
    }
    async boostrap() {
        await this.setUpGlobalMiddleware();
        await this.server.listen(this.PORT);
        if (module.hot) {
            module.hot.accept();
            module.hot.dispose(() => this.server.close());
        }
    }
    startLog() {
        if (this.DEV_MODE) {
            this.logger.log(`✅ Server on http://localhost:${this.PORT}`);
        }
        else {
            this.logger.log(`✅ Server on port ${this.PORT}...`);
        }
    }
}
async function init() {
    const server = await core_1.NestFactory.create(app_module_1.AppModule);
    const app = new Application(server);
    await app.boostrap();
    app.startLog();
}
init().catch((error) => {
    new common_1.Logger('init').error(error);
});
//# sourceMappingURL=main.js.map