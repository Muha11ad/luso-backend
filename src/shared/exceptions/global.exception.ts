import { Response } from "express";
import { setResult } from "../utils/helpers";
import { MyError } from "@/shared/utils/error";
import { CustomLogger } from "@/shared/logger/custom.logger";
import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new CustomLogger(GlobalExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        let errId = MyError.SERVER_UNKNOWN_ERROR.errId;
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = exception.message;

        if (exception instanceof BadRequestException) {
            
            console.log(exception);
            
            const response = exception.getResponse() as any;
            errId = response.errId || MyError.BAD_REQUEST.errId;
            status = HttpStatus.BAD_REQUEST;
            message = response.message || exception.message;
            this.logger.error(`BadRequestException: ${message}`, exception.message);

        } else if (exception instanceof HttpException) {
            errId = MyError.SERVER_UNKNOWN_ERROR.errId;
            status = exception.getStatus();
            message = exception.message;
            this.logger.error(`HttpException: ${message}`, exception.message);

        } else if (exception instanceof UnauthorizedException) {
            const response = exception.getResponse() as any;
            errId = response.errId || MyError.UNAUTHORIZED.errId;
            status = HttpStatus.UNAUTHORIZED;
            message = response.message || exception.message;
            this.logger.error(`UnauthorizedException: ${message}`, exception.message);

        } else {
            this.logger.error(`UnknownException: ${message}`, exception.message);
        }

        return res.status(status).jsonp(setResult({ message }, errId));
    }
}