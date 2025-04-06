import { ApiTags } from "@nestjs/swagger";
import { Public } from "@/shared/decorators";
import { Controller, Get, } from "@nestjs/common";
import { UseInterceptors } from "@nestjs/common";
import { setResult } from "@/shared/utils/helpers";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { CategoryFindService } from "@/module/admin/category/service";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";

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
    async getAll() {

        const { errId, data, total } = await this.findService.findAll();

        return setResult({ total, categories: data }, errId);

    }

}
