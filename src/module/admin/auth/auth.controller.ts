import { LoginDto } from "./dto";
import { Response } from "express";
import { Public } from "@/shared/decorators";
import { AuthService } from "./auth.service";
import { setResult } from "@/shared/utils/helpers";
import { AuthValidateReq } from "./auth.interface";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ENDPOINTS, TOKEN_KEYS } from "@/shared/utils/consts";
import { Body, Controller, Post, Res } from "@nestjs/common";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.auth)
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('login')
    async login(@Res() res: Response, @Body() body: LoginDto) {

        const requestData: AuthValidateReq = body;

        const { errId, data } = await this.authService.validate(requestData);

        if (errId) {


            return setResult({ auth: null }, errId);

        }

        res.cookie(TOKEN_KEYS.acccessToken, data.access, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24, // a day
        });

        res.cookie(TOKEN_KEYS.refreshToken, data.refresh, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7, // a week
        });

        return setResult({ auth: data }, errId);

    }

}
