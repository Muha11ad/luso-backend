import { Response } from "express";
import { UserService } from "./user.service";
import { UserIdReq } from "@/shared/utils/types";
import { UserCreateReq } from "./user.interface";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { TelegramIdDto, UserCreateDto } from "./dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseInterceptors } from "@nestjs/common";

@Controller()
@ApiTags(ENDPOINTS.user)
@ApiBearerAuth()
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('all')
    async getAll(@Res() res: Response) {

        const { errId, data } = await this.userService.getAll();

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        
        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Get(":telegramId")
    async getById(@Res() res: Response, @Param() param: TelegramIdDto) {

        const requestData: UserIdReq = { id: param.telegramId };

        const { errId, data } = await this.userService.getById(requestData)

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Post()
    async getOrCreate(@Res() res: Response, @Body() body: UserCreateDto) {

        const requestData: UserCreateReq = body

        const { errId, data: user } = await this.userService.checkExistOrCreate(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        
        }

        return res.status(HttpStatus.OK).jsonp(setResult(user, null));

    }

    @Delete(":telegramId")
    async delete(@Res() res: Response, @Param() param: TelegramIdDto) {

        const requestData: UserIdReq = { id: param.telegramId };

        const { errId } = await this.userService.delete(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).jsonp(setResult({ success: true }, null));

    }

}
