import { Product } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { ProductBaseService } from "./product.base.service";
import { BaseResponse, IdReq, SuccessRes } from "@/shared/utils/types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { ProductCategoryAddReq, ProductCategoryDeleteReq } from "../product.interface";

@Injectable()
export class ProductCategoryService extends ProductBaseService {

    public async addCategoryToProduct(reqData: ProductCategoryAddReq): Promise<BaseResponse<SuccessRes>> {

        try {

            for (const c_id of reqData.categoryIds) {

                await this.database.category.findUniqueOrThrow({ where: { id: c_id } });

            }

            await this.database.product.findUniqueOrThrow({ where: { id: reqData.id } });

            await this.database.productCategory.createMany({
                data: reqData.categoryIds.map(category_id => ({
                    category_id,
                    product_id: reqData.id
                }))
            })

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCategoryService.name, 'addCategoryToProduct');

        }

    }

    public async deleteCategoryFromProduct(reqData: ProductCategoryDeleteReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.category.findUniqueOrThrow({ where: { id: reqData.categoryId } });

            await this.database.product.findUniqueOrThrow({ where: { id: reqData.id } });

            await this.database.productCategory.deleteMany({
                where: { category_id: reqData.categoryId, product_id: reqData.id }
            })

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCategoryService.name, 'deleteCategoryFromProduct');

        }


    }

    public async getProductByCategoryId(reqData: IdReq): Promise<BaseResponse<Product[]>> {

        try {

            const products = await this.database.productCategory.findMany({
                where: { category_id: reqData.id },
                select: {
                    product: {
                        include: {
                            Images: true,
                            Characteristic: true
                        }
                    }
                }
            })

            return { errId: null, data: products.map(p => p.product) };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCategoryService.name, 'getProductByCategoryId');
            
        }


    }
}
