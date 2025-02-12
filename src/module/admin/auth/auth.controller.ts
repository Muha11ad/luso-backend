import { LoginDto } from "./dto";
import { Response } from "express";
import { Public } from "@/shared/decorators";
import { AuthService } from "./auth.service";
import { ENDPOINTS } from "@/shared/utils/consts";
import { AuthValidateReq } from "./auth.interface";
import { setResult } from "@/shared/utils/helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";

@Controller()
@ApiTags(ENDPOINTS.auth)
@ApiBearerAuth()
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post()
    @Public()
    async login(@Res() res: Response, @Body() body: LoginDto) {

        const requestData: AuthValidateReq = body;

        const { errId, data } = await this.authService.validate(requestData);

        if (errId) {
            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

}
