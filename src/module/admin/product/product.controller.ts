import { ReqIdDto } from "@/shared/dto";
import { IdReq } from "@/shared/utils/types";
import { setResult } from "@/shared/utils/helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { CacheDelete } from "@/shared/decorators/cache.decorator";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { ProductUpdateDiscountDto } from "./dto/update-product-discount.dto";
import { CacheDeleteInterceptor } from "@/shared/interceptors/cache.delete.interceptor";
import { ProductCrudService, ProductFindService, ProductCategoryService } from "./service";
import { Put, Get, Body, Post, Param, Delete, Controller, Patch, UseInterceptors } from "@nestjs/common";
import { ProductCreateDto, ProductUpdateDto, FilterProductsDto, AddCategoryToProductDto, DeleteCategoryFromProductDto, DeleteImagesFromProductDto } from "./dto";
import { ProductCategoryAddReq, ProductCategoryDeleteReq, ProductCreateReq, ProductDeleteImageReq, ProductsFilterReq, ProductUpdateDiscountReq, ProductUpdateReq } from "./product.interface";

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
    async getAll() {

        const { errId, data, total } = await this.findService.findAll();

        return setResult({ total, products: data }, errId);

    }

    @Get("/:id")
    async getById(@Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.findService.findById(requestData);

        return setResult({ products: data }, errId);

    }

    @Post("/filter")
    async getByFilter(@Body() body: FilterProductsDto) {

        const requestData: ProductsFilterReq = body

        const { errId, data } = await this.findService.findByFilter(requestData);

        return setResult({ products: data }, errId);

    }

    @Post()
    @UseInterceptors(CacheDeleteInterceptor)
    @CacheDelete(REDIS_ENDPOINT_KEYS.productAll)
    async create(@Body() body: ProductCreateDto) {

        const requestData: ProductCreateReq = body;

        const { errId, data } = await this.crudService.create(requestData);

        return setResult({ products: data }, errId);

    }

    @Put("/:id")
    @UseInterceptors(CacheDeleteInterceptor)
    @CacheDelete(REDIS_ENDPOINT_KEYS.productAll)
    async update(@Param() param: ReqIdDto, @Body() body: ProductUpdateDto) {

        const reqData: ProductUpdateReq = {
            ...body,
            id: param.id,
        }

        const { errId, data } = await this.crudService.update(reqData);

        return setResult({ products: data }, errId);

    }

    @Delete("/:id")
    @UseInterceptors(CacheDeleteInterceptor)
    @CacheDelete(REDIS_ENDPOINT_KEYS.productAll)
    async delete(@Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.crudService.delete(requestData);

        return setResult({ products: data }, errId);

    }

    @Post("category/:id")
    @UseInterceptors(CacheDeleteInterceptor)
    @CacheDelete(REDIS_ENDPOINT_KEYS.productAll)
    async addCategoryToProduct(@Param() param: ReqIdDto, @Body() body: AddCategoryToProductDto) {

        const requestData: ProductCategoryAddReq = {
            ...body,
            id: param.id,
        }

        const { errId, data } = await this.productCategoryService.addCategoryToProduct(requestData);

        return setResult({ products: data }, errId);

    }

    @Delete("category/:id")
    @UseInterceptors(CacheDeleteInterceptor)
    @CacheDelete(REDIS_ENDPOINT_KEYS.productAll)
    async deleteCategoryFromProduct(@Param() param: ReqIdDto, @Body() body: DeleteCategoryFromProductDto) {

        const requestData: ProductCategoryDeleteReq = {
            ...body,
            id: param.id,
        }

        const { errId, data } = await this.productCategoryService.deleteCategoryFromProduct(requestData);

        return setResult({ products: data }, errId);

    }

    @Get("category/:id")
    @UseInterceptors(CacheDeleteInterceptor)
    @CacheDelete(REDIS_ENDPOINT_KEYS.productAll)
    async getCategoriesByProduct(@Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.productCategoryService.getProductByCategoryId(requestData);

        return setResult({ products: data }, errId);

    }
    // this should be delete method, but in delete it is not working
    @Patch("images")
    @UseInterceptors(CacheDeleteInterceptor)
    @CacheDelete(REDIS_ENDPOINT_KEYS.productAll)
    async deleteImages(@Body() body: DeleteImagesFromProductDto) {

        const requestData: ProductDeleteImageReq = body;

        const { errId, data } = await this.crudService.deletProductImages(requestData);

        return setResult({ products: data }, errId);

    }

    @Patch('available/:id')
    @UseInterceptors(CacheDeleteInterceptor)
    @CacheDelete(REDIS_ENDPOINT_KEYS.productAll)
    async setAvailable(@Param() param: ReqIdDto) {

        const requestData: IdReq = param;

        const { errId, data } = await this.crudService.setAvailable(requestData);

        return setResult({ products: data }, errId);

    }

    @Patch('discount')
    @UseInterceptors(CacheDeleteInterceptor)
    @CacheDelete(REDIS_ENDPOINT_KEYS.productAll)
    async setDiscount(@Body() body: ProductUpdateDiscountDto) {

        const requestData: ProductUpdateDiscountReq = body

        const { errId, data } = await this.crudService.setDiscount(requestData);

        return setResult({ products: data }, errId);

    }
}

