import { ReqIdDto } from "@/shared/dto";
import { ApiTags } from "@nestjs/swagger";
import { IdReq } from "@/shared/utils/types";
import { Public } from "@/shared/decorators";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { FilterProductsDto } from "@/module/admin/product/dto";
import { Get, Body, Post, Param, Controller } from "@nestjs/common";
import { ProductsFilterReq } from "@/module/admin/product/product.interface";
import { ProductCategoryService, ProductFindService } from "@/module/admin/product/service";

@Public()
@Controller()
@ApiTags(ENDPOINTS.product)
export class ProductController {

    constructor(
        private readonly findService: ProductFindService,
        private readonly productCategoryService: ProductCategoryService
    ) { }

    @Get('all')
    async getAll() {

        const { errId, data, total } = await this.findService.findAll();

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
