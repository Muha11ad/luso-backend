import { LoginDto } from "./dto";
import { Public } from "@/shared/decorators";
import { AuthService } from "./auth.service";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { AuthValidateReq } from "./auth.interface";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Post } from "@nestjs/common";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.auth)
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('login')
    async login(@Body() body: LoginDto) {

        const requestData: AuthValidateReq = body;

        const { errId, data } = await this.authService.validate(requestData);

        if (errId) {


            return setResult({ auth: null }, errId);

        }

        return setResult({ auth: data }, errId);

    }

}
