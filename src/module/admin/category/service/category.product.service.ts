import { Injectable } from "@nestjs/common";
import { MyError } from "@/shared/utils/error";
import { CategoryBaseService } from "./category.base.service";
import { BaseResponse, SuccessRes } from "@/shared/utils/types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { CategoryProductAddReq, CategoryProductDeleteReq } from "../category.interface";

@Injectable()
export class CategoryProductService extends CategoryBaseService {

    public async addProductToCategory(reqData: CategoryProductAddReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.checkCategoryAndProductsExist(reqData);


            const { data: filteredProductIds } = await this.filterDuplicateProductInCategory(reqData);

            if (filteredProductIds.length === 0) {

                return { errId: MyError.UNIQUE_CONSTRAINT_FAILED.errId, data: null }

            }

            await this.database.productCategory.createMany({
                data: filteredProductIds.map((p_id) => ({
                    product_id: p_id,
                    category_id: reqData.id,
                })),
            });

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, CategoryProductService.name, this.addProductToCategory.name);

        }

    }

    public async deleteProductFromCategory(redData: CategoryProductDeleteReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.checkCategoryAndProductsExist(redData);

            await this.database.productCategory.deleteMany({
                where: {
                    category_id: redData.id,
                    product_id: { in: redData.productIds }
                }
            })

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, CategoryProductService.name, this.deleteProductFromCategory.name);

        }

    }

    private async checkCategoryAndProductsExist(reqData: CategoryProductAddReq): Promise<void> {

        await this.database.category.findUniqueOrThrow({
            where: { id: reqData.id }
        })

        for (const p_id of reqData.productIds) {

            await this.database.product.findUniqueOrThrow({ where: { id: p_id } });

        }

    }

    private async filterDuplicateProductInCategory(reqData: CategoryProductAddReq): Promise<BaseResponse<string[]>> {

        const existingProductIds: string[] = await this.database.productCategory
            .findMany({
                where: {
                    category_id: reqData.id,
                    product_id: { in: reqData.productIds }
                },
                select: { product_id: true }
            })
            .then((products) => products.map((product) => product.product_id));

        return { errId: null, data: reqData.productIds.filter((p_id) => !existingProductIds.includes(p_id)) };

    }


}
