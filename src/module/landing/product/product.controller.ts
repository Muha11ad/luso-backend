import { Response } from "express";
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
import { Get, Body, Post, Param, Controller, Res, HttpStatus, UseInterceptors, Query } from "@nestjs/common";

@Controller()
@ApiTags(ENDPOINTS.product)
@Public()
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

        const { errId, data } = await this.findService.findAll(requestData);

        return setResult(data, errId)
    }

    @Get("/:id")
    async getById(@Res() res: Response, @Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.findService.findById(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));
    }

    @Post("/filter")
    async getByFilter(@Res() res: Response, @Body() body: FilterProductsDto) {

        const requestData: ProductsFilterReq = body

        const { errId, data: products } = await this.findService.findByFilter(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(products, null));

    }

    @Get("category/:id")
    async getCategoriesByProduct(@Res() res: Response, @Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.productCategoryService.getProductByCategoryId(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

}
