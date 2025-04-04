import { ReqIdDto } from "@/shared/dto";
import { ApiTags } from "@nestjs/swagger";
import { IdReq } from "@/shared/utils/types";
import { Public } from "@/shared/decorators";
import { FilterProductsDto } from "@/module/admin/product/dto";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { handlePagination, setResult } from "@/shared/utils/helpers";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { PaginationDto } from "@/module/admin/order/dto/pagination.dto";
import { ProductCategoryService, ProductFindService } from "@/module/admin/product/service";
import { ProductGetAllReq, ProductsFilterReq } from "@/module/admin/product/product.interface";
import { Get, Body, Post, Param, Controller, UseInterceptors, Query } from "@nestjs/common";

@Public()
@Controller()
@ApiTags(ENDPOINTS.product)
export class ProductController {

    constructor(
        private readonly findService: ProductFindService,
        private readonly productCategoryService: ProductCategoryService
    ) { }

    @Get('all')
    @UseInterceptors(CacheInterceptor)
    @CacheKey(REDIS_ENDPOINT_KEYS.productAll)
    async getAll(@Query() query: PaginationDto) {

        const requestData: ProductGetAllReq = {
            pagination: handlePagination(query),
        }

        const { errId, data, total } = await this.findService.findAll(requestData);

        return setResult({ total, products: data }, errId)
    }

    @Get("/:id")
    async getById(@Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.findService.findById(requestData);

        return setResult({ products: data }, errId)

    }

    @Post("/filter")
    async getByFilter(@Body() body: FilterProductsDto) {

        const requestData: ProductsFilterReq = body

        const { errId, data } = await this.findService.findByFilter(requestData);

        return setResult({ products: data }, errId)

    }

    @Get("category/:id")
    async getCategoriesByProduct(@Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.productCategoryService.getProductByCategoryId(requestData);

        return setResult({ products: data }, errId)
    }

}
