import { ReqIdDto } from "@/shared/dto/id.dto";
import { Param, Delete, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "../order/dto/pagination.dto";
import { CacheDelete } from "@/shared/decorators/cache.decorator";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { handlePagination, setResult } from "@/shared/utils/helpers";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { Body, Controller, Get, Post, Query, UseInterceptors, } from "@nestjs/common";
import { CategoryCrudService, CategoryFindService, CategoryProductService } from "./service";
import { CategoryCreateDto, CategoryUpdateDto, AddProductToCategoryDto, DeleteProductFromCategoryDto } from "./dto";
import { CategoryCreateReq, CategoryDeleteReq, CategoryGetAllReq, CategoryProductAddReq, CategoryProductDeleteReq, CategoryUpdateReq } from "./category.interface";

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
    @UseInterceptors(CacheInterceptor)
    @CacheKey(REDIS_ENDPOINT_KEYS.categoryAll)
    async getAll(@Query() query: PaginationDto) {

        const requestData: CategoryGetAllReq = {
            pagination: handlePagination(query),
        }

        const { errId, data, total } = await this.findService.findAll(requestData);

        return setResult({ total, categories: data }, errId);

    }

    @Post()
    @CacheDelete(REDIS_ENDPOINT_KEYS.categoryAll)
    async create(@Body() body: CategoryCreateDto) {

        const requestData: CategoryCreateReq = body;

        const { errId, data } = await this.crudService.create(requestData);

        return setResult({ categories: data }, errId);

    }

    @Put(":id")
    @CacheDelete(REDIS_ENDPOINT_KEYS.categoryAll)
    async updateCategory(@Param() param: ReqIdDto, @Body() body: CategoryUpdateDto) {

        const requestData: CategoryUpdateReq = { ...body, id: param.id, };

        const { errId, data } = await this.crudService.update(requestData);

        return setResult({ categories: data }, errId);
    }

    @Delete(":id")
    @CacheDelete(REDIS_ENDPOINT_KEYS.categoryAll)
    async deleteCategory(@Param() param: ReqIdDto) {

        const requestData: CategoryDeleteReq = param;

        const { errId, data } = await this.crudService.delete(requestData);

        return setResult({ categories: data }, errId);

    }

    @Post("product/:id")
    @CacheDelete(REDIS_ENDPOINT_KEYS.categoryAll)
    async addProductToCategory(@Param() param: ReqIdDto, @Body() body: AddProductToCategoryDto
    ) {

        const requestData: CategoryProductAddReq = {
            ...body,
            id: param.id,
        };

        const { errId, data } = await this.categoryProductService.addProductToCategory(requestData);

        return setResult({ categories: data }, errId);

    }

    @Delete("product/:id")
    @CacheDelete(REDIS_ENDPOINT_KEYS.categoryAll)
    async deleteProductFromCategory(@Param() param: ReqIdDto, @Body() body: DeleteProductFromCategoryDto) {

        const requestData: CategoryProductDeleteReq = {
            ...body,
            id: param.id,
        };

        const { errId, data } = await this.categoryProductService.deleteProductFromCategory(requestData);

        return setResult({ categories: data }, errId);
    }

}
