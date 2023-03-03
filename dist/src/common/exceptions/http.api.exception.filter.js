"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpApiExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpApiExceptionFilter = class HttpApiExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const error = exception.getResponse();
        if (typeof error === 'string') {
            response.status(status).json({
                success: false,
                statusCode: status,
                error,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
        else {
            response.status(status).json(Object.assign({ success: false, timestamp: new Date().toISOString() }, error));
        }
    }
};
HttpApiExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpApiExceptionFilter);
exports.HttpApiExceptionFilter = HttpApiExceptionFilter;
//# sourceMappingURL=http.api.exception.filter.js.map