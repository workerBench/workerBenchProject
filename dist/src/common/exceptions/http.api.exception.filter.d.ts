import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
export declare class HttpApiExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
