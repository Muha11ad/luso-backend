import { LoginDto } from "./dto";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ENDPOINTS } from "@/shared/utils/consts";
import { AuthValidateReq } from "./auth.interface";
import { setResult } from "@/shared/utils/helpers";
import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";

@Controller(ENDPOINTS.auth)
@ApiTags(ENDPOINTS.auth)
@ApiBearerAuth()
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post()
    async login(@Res() res: Response, @Body() body: LoginDto) {

        const requestData: AuthValidateReq = body;

        const { errId, data } = await this.authService.validate(requestData);

        if (errId) {
            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

}
