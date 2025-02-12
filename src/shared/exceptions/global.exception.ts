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

        if (exception instanceof BadRequestException) {

            const response = exception.getResponse() as any;
            errId = response.errId || MyError.BAD_REQUEST.errId;
            status = HttpStatus.BAD_REQUEST;
            this.logger.error(`BadRequestException: ${exception.message}`, exception.stack);

        } else if (exception instanceof HttpException) {

            errId = MyError.SERVER_UNKNOWN_ERROR.errId;
            status = exception.getStatus();
            this.logger.error(`HttpException: ${exception.message}`, exception.stack);

        } else if (exception instanceof UnauthorizedException) {

            const response = exception.getResponse() as any;
            errId = response.errId || MyError.UNAUTHORIZED.errId;
            status = HttpStatus.UNAUTHORIZED;
            this.logger.error(`UnauthorizedException: ${exception.message}`, exception.stack);

        }


        return res.status(status).jsonp(setResult(null, errId));
    }
}
