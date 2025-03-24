import { Response } from "express";
import { ReqIdDto } from "@/shared/dto";
import { IdReq } from "@/shared/utils/types";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ProductCrudService, ProductFindService, ProductCategoryService } from "./service";
import { Put, Get, Body, Post, Param, Delete, Controller, Res, HttpStatus, Patch } from "@nestjs/common";
import { ProductCreateDto, ProductUpdateDto, FilterProductsDto, AddCategoryToProductDto, DeleteCategoryFromProductDto, DeleteImagesFromProductDto } from "./dto";
import { ProductCategoryAddReq, ProductCategoryDeleteReq, ProductCreateReq, ProductDeleteImageReq, ProductsFilterReq, ProductUpdateReq } from "./product.interface";

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
    async getAll(@Res() res: Response) {

        const { errId, data } = await this.findService.findAll();

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));
        
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
    async create(@Res() res: Response, @Body() body: ProductCreateDto) {

        const requestData: ProductCreateReq = body;

        const { errId, data } = await this.crudService.create(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.CREATED).jsonp(setResult(data, null));

    }

    @Put("/:id")
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
    async delete(@Res() res: Response, @Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.crudService.delete(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Post("category/:id")
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
    async getCategoriesByProduct(@Res() res: Response, @Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.productCategoryService.getProductByCategoryId(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }
    // this should be delete method, but in delete it is not working
    @Patch("images")
    async deleteImages(@Res() res: Response, @Body() body: DeleteImagesFromProductDto ) {

        const requestData: ProductDeleteImageReq = body;

        const { errId, data } = await this.crudService.deletProductImages(requestData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

}

