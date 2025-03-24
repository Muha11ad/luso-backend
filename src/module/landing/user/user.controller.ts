import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "@/shared/decorators";
import { UserCreateDto } from "../../admin/user";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { UserService } from "../../admin/user/user.service";
import { UserCreateReq } from "../../admin/user/user.interface";
import { Body, Controller, HttpStatus, Post, Res, } from "@nestjs/common";

@Public()
@Controller()
@ApiTags(ENDPOINTS.user)
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post()
    async getOrCreate(@Res() res: Response, @Body() body: UserCreateDto) {

        const requestData: UserCreateReq = body

        const { errId, data: user } = await this.userService.checkExistOrCreate(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(user, null));

    }
}
