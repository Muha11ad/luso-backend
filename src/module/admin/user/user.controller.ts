import { Response } from "express";
import { UserService } from "./user.service";
import { UserIdReq } from "@/shared/utils/types";
import { UserCreateReq, UserGetAllReq } from "./user.interface";
import { ENDPOINTS } from "@/shared/utils/consts";
import { handlePagination, setResult } from "@/shared/utils/helpers";
import { TelegramIdDto, UserCreateDto } from "./dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Res } from "@nestjs/common";
import { PaginationDto } from "../order/dto/pagination.dto";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.user)
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('all')
    async getAll(@Res() res: Response, @Query() query: PaginationDto) {

        const requestData: UserGetAllReq = {
            pagination: handlePagination(query)
        }

        const { errId, data, total } = await this.userService.getAll(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult({ users: data, total }, null));

    }

    @Get(":telegramId")
    async getById(@Res() res: Response, @Param() param: TelegramIdDto) {

        const requestData: UserIdReq = { id: param.telegramId };

        const { errId, data } = await this.userService.getById(requestData)

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId))

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Post()
    async getOrCreate(@Res() res: Response, @Body() body: UserCreateDto) {

        const requestData: UserCreateReq = body

        const { errId, data: user } = await this.userService.checkExistOrCreate(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(user, null));

    }

    @Delete(":telegramId")
    async delete(@Res() res: Response, @Param() param: TelegramIdDto) {

        const requestData: UserIdReq = { id: param.telegramId };

        const { errId } = await this.userService.delete(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId))

        return res.status(HttpStatus.OK).jsonp(setResult({ success: true }, null));

    }

}
