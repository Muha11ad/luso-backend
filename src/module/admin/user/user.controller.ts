import { UserService } from "./user.service";
import { UserIdReq } from "@/shared/utils/types";
import { TelegramIdDto, UserCreateDto } from "./dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "../order/dto/pagination.dto";
import { UserCreateReq, UserGetAllReq } from "./user.interface";
import { CacheDelete } from "@/shared/decorators/cache.decorator";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { handlePagination, setResult } from "@/shared/utils/helpers";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { Body, Controller, Delete, Get, Param, Post, Query, UseInterceptors } from "@nestjs/common";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.user)
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('all')
    @UseInterceptors(CacheInterceptor)
    @CacheKey(REDIS_ENDPOINT_KEYS.userAll)
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
    @CacheDelete(REDIS_ENDPOINT_KEYS.userAll)
    async getOrCreate(@Body() body: UserCreateDto) {

        const requestData: UserCreateReq = body

        const { errId, data } = await this.userService.checkExistOrCreate(requestData);

        return setResult({ users: data }, errId);

    }

    @Delete(":telegramId")
    @CacheDelete(REDIS_ENDPOINT_KEYS.userAll)
    async delete(@Param() param: TelegramIdDto) {

        const requestData: UserIdReq = { id: param.telegramId };

        const { errId, data } = await this.userService.delete(requestData);

        return setResult({ users: data }, errId);

    }

}
