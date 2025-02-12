import { Response } from "express";
import { setResult } from "../utils/helpers";
import { MyError } from "@/shared/utils/error";
import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        let errId = MyError.SERVER_UNKNOWN_ERROR.errId; 
        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof BadRequestException) {
            
            const response = exception.getResponse() as any;
            errId = response.errId || MyError.BAD_REQUEST.errId;
            status = HttpStatus.BAD_REQUEST;
        
        } else if (exception instanceof HttpException) {
        
            errId = MyError.SERVER_UNKNOWN_ERROR.errId;
            status = exception.getStatus();
       
        }
        

        return res.status(status).jsonp(setResult(null, errId));

    }
}
