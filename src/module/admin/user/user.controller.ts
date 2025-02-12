import { AuthGuard } from "../auth";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserIdReq } from "@/shared/utils/types";
import { UserCreateReq } from "./user.interface";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { TelegramIdDto, UserCreateDto } from "./dto";
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseGuards } from "@nestjs/common";

@Controller(ENDPOINTS.user)
@ApiTags(ENDPOINTS.user)
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('all')
    @UseGuards(AuthGuard)
    async getAll(@Res() res: Response) {

        const { errId, data } = await this.userService.findAll();

        if (errId) {
            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Get("/:telegram_id")
    @UseGuards(AuthGuard)
    async getById(@Res() res: Response, @Param() param: TelegramIdDto) {

        const requestData: UserIdReq = { id: param.telegramId };

        const { errId, data } = await this.userService.findById(requestData)

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

    @Delete("/:telegram_id")
    @UseGuards(AuthGuard)
    async delete(@Res() res: Response, @Param() param: TelegramIdDto) {

        const requestData: UserIdReq = { id: param.telegramId };

        const { errId } = await this.userService.delete(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).jsonp(setResult({ success: true }, null));

    }

}
