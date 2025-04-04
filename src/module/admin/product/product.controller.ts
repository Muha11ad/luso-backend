import { Response } from "express";
import { ReqIdDto } from "@/shared/dto";
import { IdReq } from "@/shared/utils/types";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "../order/dto/pagination.dto";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { handlePagination, setResult } from "@/shared/utils/helpers";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { ProductCrudService, ProductFindService, ProductCategoryService } from "./service";
import { Put, Get, Body, Post, Param, Delete, Controller, Res, HttpStatus, Patch, Query, UseInterceptors } from "@nestjs/common";
import { ProductCreateDto, ProductUpdateDto, FilterProductsDto, AddCategoryToProductDto, DeleteCategoryFromProductDto, DeleteImagesFromProductDto } from "./dto";
import { ProductCategoryAddReq, ProductCategoryDeleteReq, ProductCreateReq, ProductDeleteImageReq, ProductGetAllReq, ProductsFilterReq, ProductUpdateReq } from "./product.interface";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.product)
export class ProductController {

    constructor(
        private readonly findService: ProductFindService,
        private readonly crudService: ProductCrudService,
        private readonly productCategoryService: ProductCategoryService
    ) { }

    @Get('all')
    @UseInterceptors(CacheInterceptor)
    @CacheKey(REDIS_ENDPOINT_KEYS.productAll)
    async getAll(@Query() query: PaginationDto,) {

        const requestData: ProductGetAllReq = {
            pagination: handlePagination(query),
        }

        const { errId, data } = await this.findService.findAll(requestData);

        return setResult(data, errId);

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

    @Post()
    @Delete(REDIS_ENDPOINT_KEYS.productAll)
    async create(@Res() res: Response, @Body() body: ProductCreateDto) {

        const requestData: ProductCreateReq = body;

        const { errId, data } = await this.crudService.create(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.CREATED).jsonp(setResult(data, null));

    }

    @Put("/:id")
    @Delete(REDIS_ENDPOINT_KEYS.productAll)
    async update(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: ProductUpdateDto) {

        const reqData: ProductUpdateReq = {
            ...body,
            id: param.id,
        }

        const { errId, data } = await this.crudService.update(reqData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Delete("/:id")
    @Delete(REDIS_ENDPOINT_KEYS.productAll)
    async delete(@Res() res: Response, @Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.crudService.delete(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Post("category/:id")
    @Delete(REDIS_ENDPOINT_KEYS.productAll)
    async addCategoryToProduct(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: AddCategoryToProductDto) {

        const requestData: ProductCategoryAddReq = {
            ...body,
            id: param.id,
        }

        const { errId, data } = await this.productCategoryService.addCategoryToProduct(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Delete("category/:id")
    @Delete(REDIS_ENDPOINT_KEYS.productAll)
    async deleteCategoryFromProduct(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: DeleteCategoryFromProductDto) {

        const requestData: ProductCategoryDeleteReq = {
            ...body,
            id: param.id,
        }

        const { errId, data } = await this.productCategoryService.deleteCategoryFromProduct(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Get("category/:id")
    @Delete(REDIS_ENDPOINT_KEYS.productAll)
    async getCategoriesByProduct(@Res() res: Response, @Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.productCategoryService.getProductByCategoryId(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }
    // this should be delete method, but in delete it is not working
    @Patch("images")
    @Delete(REDIS_ENDPOINT_KEYS.productAll)
    async deleteImages(@Res() res: Response, @Body() body: DeleteImagesFromProductDto) {

        const requestData: ProductDeleteImageReq = body;

        const { errId, data } = await this.crudService.deletProductImages(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

}

