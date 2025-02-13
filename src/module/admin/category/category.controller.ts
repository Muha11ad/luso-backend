import { Response } from "express";
import { ReqIdDto } from "@/shared/dto/id.dto";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Post, } from "@nestjs/common";
import { Param, Delete, Put, HttpStatus, Res } from "@nestjs/common";
import { CategoryCrudService, CategoryFindService, CategoryProductService } from "./service";
import { CategoryCreateDto, CategoryUpdateDto, AddProductToCategoryDto, DeleteProductFromCategoryDto } from "./dto";
import { CategoryCreateReq, CategoryDeleteReq, CategoryProductAddReq, CategoryProductDeleteReq, CategoryUpdateReq } from "./category.interface";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.category)
export class CategoryController {

    constructor(
        private readonly crudService: CategoryCrudService,
        private readonly findService: CategoryFindService,
        private readonly categoryProductService: CategoryProductService
    ) { }

    @Get('all')
    async getAll(@Res() res: Response) {

        const { errId, data } = await this.findService.findAll();

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).json(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Post()
    async create(@Res() res: Response, @Body() body: CategoryCreateDto) {

        const requestData: CategoryCreateReq = body;

        const { errId, data } = await this.crudService.create(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        }

        return res.status(HttpStatus.CREATED).jsonp(setResult(data, null));

    }

    @Put(":id")
    async updateCategory(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: CategoryUpdateDto) {

        const requestData: CategoryUpdateReq = { ...body, id: param.id, };

        const { errId, data } = await this.crudService.update(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Delete(":id")
    async deleteCategory(@Res() res: Response, @Param() param: ReqIdDto) {

        const requestData: CategoryDeleteReq = param;

        const { errId, data } = await this.crudService.delete(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

    @Post("product/:id")
    async addProductToCategory(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: AddProductToCategoryDto
    ) {

        const requestData: CategoryProductAddReq = { ...body, id: param.id, };

        const { errId, data } = await this.categoryProductService.addProductToCategory(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        }

        return res.status(HttpStatus.CREATED).jsonp(setResult(data, null));

    }

    @Delete("product/:id")
    async deleteProductFromCategory(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: DeleteProductFromCategoryDto) {

        const requestData: CategoryProductDeleteReq = { ...body, id: param.id, };

        const { errId, data: result } = await this.categoryProductService.deleteProductFromCategory(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).jsonp(setResult(result, null));

    }

}
