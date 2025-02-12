import { AuthGuard } from "../auth";
import { Response } from "express";
import { ReqIdDto } from "@/shared/dto";
import { ApiTags } from "@nestjs/swagger";
import { IdReq } from "@/shared/utils/types";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ProductCrudService, ProductFindService, ProductCategoryService } from "./service";
import { Put, Get, Body, Post, Param, Delete, UseGuards, Controller, UseInterceptors, Res, HttpStatus } from "@nestjs/common";
import { ProductCreateDto, ProductUpdateDto, FilterProductsDto, AddCategoryToProductDto, DeleteCategoryFromProductDto } from "./dto";
import { ProductCategoryAddReq, ProductCategoryDeleteReq, ProductCreateReq, ProductsFilterReq, ProductUpdateReq } from "./product.interface";

@Controller(ENDPOINTS.product)
@ApiTags(ENDPOINTS.product)
export class ProductController {

    constructor(
        private readonly findService: ProductFindService,
        private readonly crudService: ProductCrudService,
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

    @Post()
    @UseGuards(AuthGuard)
    async create(@Res() res: Response, @Body() body: ProductCreateDto) {

        const requestData: ProductCreateReq = body;

        const { errId, data } = await this.crudService.create(requestData);

        if (errId) {
            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Put("/:id")
    @UseGuards(AuthGuard)
    async update(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: ProductUpdateDto) {

        const reqData: ProductUpdateReq = {
            ...body,
            id: param.id,
        }

        const { errId, data } = await this.crudService.update(reqData);

        if (errId) {
            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Delete("/:id")
    @UseGuards(AuthGuard)
    async delete(@Res() res: Response, @Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.crudService.delete(requestData);

        if (errId) {
            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Post("category/:id")
    @UseGuards(AuthGuard)
    async addCategoryToProduct(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: AddCategoryToProductDto) {

        const requestData: ProductCategoryAddReq = {
            ...body,
            id: param.id,
        }

        const { errId, data } = await this.productCategoryService.addCategoryToProduct(requestData);

        if (errId) {
            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Delete("category/:id")
    @UseGuards(AuthGuard)
    async deleteCategoryFromProduct(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: DeleteCategoryFromProductDto) {

        const requestData: ProductCategoryDeleteReq = {
            ...body,
            id: param.id,
        }

        const { errId, data } = await this.productCategoryService.deleteCategoryFromProduct(requestData);

        if (errId) {
            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));
        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

}
