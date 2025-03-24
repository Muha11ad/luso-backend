import { LoginDto } from "./dto";
import { Response } from "express";
import { Public } from "@/shared/decorators";
import { AuthService } from "./auth.service";
import { RefreshDto } from "./dto/refresh.dto";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthRefreshReq, AuthValidateReq } from "./auth.interface";
import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.auth)
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @Public()
    async login(@Res() res: Response, @Body() body: LoginDto) {

        const requestData: AuthValidateReq = body;

        const { errId, data } = await this.authService.validate(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Post('refresh')
    @Public()
    async refresh(@Res() res: Response, @Body() body: RefreshDto) {

        const requestData: AuthRefreshReq = body;

        const { errId, data } = await this.authService.refreshToken(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

}
