import { Response } from "express";
import { ReqIdDto } from "@/shared/dto/id.dto";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Param, Delete, Put, UseInterceptors, HttpStatus, Res } from "@nestjs/common";
import { CategoryCrudService, CategoryFindService, CategoryProductService } from "./service";
import { CategoryCreateDto, CategoryUpdateDto, AddProductToCategoryDto, DeleteProductFromCategoryDto } from "./dto";
import { CategoryCreateReq, CategoryDeleteReq, CategoryProductAddReq, CategoryProductDeleteReq, CategoryUpdateReq } from "./category.interface";

@Controller(ENDPOINTS.category)
@ApiTags(ENDPOINTS.category)
@ApiBearerAuth()
export class CategoryController {

    constructor(
        private readonly crudService: CategoryCrudService,
        private readonly findService: CategoryFindService,
        private readonly categoryProductService: CategoryProductService
    ) { }

    @Get('all')
    @UseInterceptors(CacheInterceptor)
    async getAll(@Res() res: Response) {

        const { errId, data } = await this.findService.findAll();

        if (errId) {

            return res.status(HttpStatus.BAD_GATEWAY).send(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).send(setResult(data, null));

    }

    @Post()
    async create(@Res() res: Response, @Body() body: CategoryCreateDto) {

        const requestData: CategoryCreateReq = body;

        const { errId, data } = await this.crudService.create(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).send(setResult(null, errId));

        }

        return res.status(HttpStatus.CREATED).send(setResult(data, null));

    }

    @Put(":id")
    async updateCategory(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: CategoryUpdateDto) {

        const requestData: CategoryUpdateReq = { ...body, id: param.id, };

        const { errId, data } = await this.crudService.update(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).send(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).send(setResult(data, null));

    }

    @Delete(":id")
    async deleteCategory(@Res() res: Response, @Param() param: ReqIdDto) {

        const requestData: CategoryDeleteReq = param;

        const { errId, data } = await this.crudService.delete(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).send(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).send(setResult(data, null));

    }

    @Post(":id")
    async addProductToCategory(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: AddProductToCategoryDto
    ) {

        const requestData: CategoryProductAddReq = { ...body, id: param.id, };

        const { errId, data } = await this.categoryProductService.addProductToCategory(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).send(setResult(null, errId));

        }

        return res.status(HttpStatus.CREATED).send(setResult(data, null));

    }

    @Delete(":id/product")
    async deleteProductFromCategory(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: DeleteProductFromCategoryDto) {

        const requestData: CategoryProductDeleteReq = { ...body, id: param.id, };

        const { errId, data: result } = await this.categoryProductService.deleteProductFromCategory(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).send(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).send(setResult(result, null));

    }

}
