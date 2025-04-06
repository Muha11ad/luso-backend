import { UserService } from "./user.service";
import { ENDPOINTS } from "@/shared/utils/consts";
import { UserIdReq } from "@/shared/utils/types";
import { TelegramIdDto, UserCreateDto } from "./dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "../order/dto/pagination.dto";
import { UserCreateReq, UserGetAllReq } from "./user.interface";
import { handlePagination, setResult } from "@/shared/utils/helpers";
import { Body, Controller, Delete, Get, Param, Post, Query, } from "@nestjs/common";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.user)
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('all')
    async getAll(@Query() query: PaginationDto) {

        const requestData: UserGetAllReq = {
            pagination: handlePagination(query)
        }

        const { errId, data, total } = await this.userService.getAll(requestData);

        return setResult({ total, users: data }, errId);

    }

    @Get(":telegramId")
    async getById(@Param() param: TelegramIdDto) {

        const requestData: UserIdReq = { id: param.telegramId };

        const { errId, data } = await this.userService.getById(requestData)

        return setResult({ users: data }, errId);

    }

    @Post()
    async getOrCreate(@Body() body: UserCreateDto) {

        const requestData: UserCreateReq = body

        const { errId, data } = await this.userService.checkExistOrCreate(requestData);

        return setResult({ users: data }, errId);

    }

    @Delete(":telegramId")
    async delete(@Param() param: TelegramIdDto) {

        const requestData: UserIdReq = { id: param.telegramId };

        const { errId, data } = await this.userService.delete(requestData);

        return setResult({ users: data }, errId);

    }

}
