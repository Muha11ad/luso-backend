import { Response } from "express";
import { ReqIdDto } from "@/shared/dto";
import { ApiTags } from "@nestjs/swagger";
import { IdReq } from "@/shared/utils/types";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { FilterProductsDto } from "@/module/admin/product/dto";
import { ProductsFilterReq } from "@/module/admin/product/product.interface";
import { ProductCategoryService, ProductFindService } from "@/module/admin/product/service";
import { Get, Body, Post, Param, Controller, UseInterceptors, Res, HttpStatus } from "@nestjs/common";

@Controller()
@ApiTags(ENDPOINTS.product)
export class ProductController {

    constructor(
        private readonly findService: ProductFindService,
        private readonly productCategoryService: ProductCategoryService
    ) { }

    @Get('all')
    @UseInterceptors(CacheInterceptor)
    async getAll(@Res() res: Response) {

        const { errId, data } = await this.findService.findAll();

        if (errId) {
            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));
    }

    @Get("/:id")
    @UseInterceptors(CacheInterceptor)
    async getById(@Res() res: Response, @Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.findService.findById(requestData);

        if (errId) {
            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));
    }

    @Post("/filter")
    @UseInterceptors(CacheInterceptor)
    async getByFilter(@Res() res: Response, @Body() body: FilterProductsDto) {

        const requestData: ProductsFilterReq = body

        const { errId, data: products } = await this.findService.findByFilter(requestData);

        if (errId) {
            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        }

        return res.status(HttpStatus.OK).jsonp(setResult(products, null));

    }

    @Get("category/:id")
    @UseInterceptors(CacheInterceptor)
    async getCategoriesByProduct(@Res() res: Response, @Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.productCategoryService.getProductByCategoryId(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

}
