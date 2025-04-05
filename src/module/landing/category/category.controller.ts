import { ApiTags } from "@nestjs/swagger";
import { Public } from "@/shared/decorators";
import { Controller, Get, } from "@nestjs/common";
import { Query, UseInterceptors } from "@nestjs/common";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { handlePagination, setResult } from "@/shared/utils/helpers";
import { CategoryFindService } from "@/module/admin/category/service";
import { PaginationDto } from "@/module/admin/order/dto/pagination.dto";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { CategoryGetAllReq } from "@/module/admin/category/category.interface";

@Public()
@Controller()
@ApiTags(ENDPOINTS.category)
export class CategoryController {

    constructor(
        private readonly findService: CategoryFindService,
    ) { }

    @Get('all')
    @UseInterceptors(CacheInterceptor)
    @CacheKey(REDIS_ENDPOINT_KEYS.categoryAll)
    async getAll(@Query() query: PaginationDto) {

        const requestData: CategoryGetAllReq = {
            pagination: handlePagination(query),
        }

        const { errId, data, total } = await this.findService.findAll(requestData);

        return setResult({ total, categories: data }, errId);

    }

}
