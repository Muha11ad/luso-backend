import { Injectable } from "@nestjs/common";
import { MyError } from "@/shared/utils/error";
import { ProductBaseService } from "./product.base.service";
import { ProductCreateEntity, ProductUpdateEntity } from "../entity";
import { BaseResponse, IdReq, SuccessRes } from "@/shared/utils/types";
import { ProductCreateReq, ProductUpdateReq } from "../product.interface";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";

@Injectable()
export class ProductCrudService extends ProductBaseService {

    public async create(reqData: ProductCreateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            const nameExists = await this.database.product.findUnique({
                where: { name: reqData.name }
            });

            if (nameExists) {

                return { errId: MyError.DUPLICATE_NAME.errId, data: null };

            }

            const productEntity = new ProductCreateEntity(reqData);

            await this.database.product.create({ data: productEntity.toPrisma() })

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, 'create');

        }

    }

    public async update(reqData: ProductUpdateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            if (reqData["name"]) {

                const nameExists = await this.database.product.findUnique({
                    where: { name: reqData.name }
                });

                if (nameExists) {

                    return { errId: MyError.DUPLICATE_NAME.errId, data: null };

                }

            }

            const existingProduct = await this.database.product.findUniqueOrThrow({ where: { id: reqData.id } });

            const productEntity = new ProductUpdateEntity(existingProduct, reqData);
            await this.database.product.update({
                where: { id: reqData.id },
                data: productEntity.toPrisma()
            })

            return { errId: null, data: { success: true } };
        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, 'update');

        }

    }

    public async delete(reqData: IdReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.product.findUniqueOrThrow({ where: { id: reqData.id } });

            await this.database.product.delete({ where: { id: reqData.id } });

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, 'delete');

        }

    }

}
