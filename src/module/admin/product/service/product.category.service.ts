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

            return ServiceExceptions.handle(error, ProductCategoryService.name, this.addCategoryToProduct.name);

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

            return ServiceExceptions.handle(error, ProductCategoryService.name, this.deleteCategoryFromProduct.name);

        }


    }

    public async getProductByCategoryId(reqData: IdReq): Promise<BaseResponse<Product[]>> {

        try {

            await this.database.category.update({
                where: { id: reqData.id },
                data: { views: { increment: 1 } }
            });

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

            const productToBeSent = products.map(p => p.product)

            return { errId: null, data: productToBeSent };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCategoryService.name, this.getProductByCategoryId.name);

        }


    }
}
