import { Injectable } from "@nestjs/common";
import { MyError } from "@/shared/utils/error";
import { FolderName } from "@/shared/utils/enums";
import { DatabaseProvider } from "@/shared/providers";
import { ProductBaseService } from "./product.base.service";
import { UploadService } from "../../upload/upload.service";
import { ProductCreateEntity, ProductUpdateEntity } from "../entity";
import { BaseResponse, IdReq, SuccessRes } from "@/shared/utils/types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { ProductCreateReq, ProductDeleteImageReq, ProductUpdateDiscountReq, ProductUpdateReq } from "../product.interface";

@Injectable()
export class ProductCrudService extends ProductBaseService {

    constructor(
        public database: DatabaseProvider,
        public uploadService: UploadService,
    ) {
        super(database);
    }

    public async create(reqData: ProductCreateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            const productEntity = new ProductCreateEntity(reqData);

            await this.database.product.create({

                data: productEntity.toPrisma()

            });

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, this.create.name);

        }

    }

    public async update(reqData: ProductUpdateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            const existingProduct = await this.database.product.findUniqueOrThrow({ where: { id: reqData.id } });

            const productEntity = new ProductUpdateEntity(existingProduct, reqData);

            await this.database.product.update({
                where: { id: reqData.id },
                data: productEntity.toPrisma()
            })

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, this.update.name);

        }

    }

    public async delete(reqData: IdReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.product.delete({ where: { id: reqData.id } });

            const productImages = await this.database.productImages.findMany({ where: { product_id: reqData.id } });

            const files = productImages.map(image => image.imageUrl);

            await this.database.productImages.deleteMany({ where: { product_id: reqData.id } });

            await this.uploadService.deleteMultipleFiles({ fileNames: files, folder: FolderName.PRODUCT });

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, this.delete.name);

        }

    }

    public async deletProductImages(reqData: ProductDeleteImageReq): Promise<BaseResponse<SuccessRes>> {

        try {

            let imageUrls = []


            for (const id of reqData.imageIds) {

                const image = await this.database.productImages.delete({ where: { id } });

                imageUrls.push(image.imageUrl)

            }

            await this.uploadService.deleteMultipleFiles({ fileNames: imageUrls, folder: FolderName.PRODUCT });

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, this.deletProductImages.name);

        }

    }

    public async setAvailable(reqData: IdReq): Promise<BaseResponse<SuccessRes>> {

        try {

            const existingProduct = await this.database.product.findUniqueOrThrow({ where: { id: reqData.id } });

            await this.database.product.update({
                where: { id: reqData.id },
                data: { available: !existingProduct.available }
            })

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, this.setAvailable.name);

        }
    }

    public async setDiscount(reqData: ProductUpdateDiscountReq): Promise<BaseResponse<SuccessRes>> {

        try {

            const existingProduct = await this.database.product.findUniqueOrThrow({ where: { id: reqData.id } });

            if(reqData.discount > existingProduct.price) {

                return { errId: MyError.PRODUCT_INVALID_DISCOUNT.errId, data: { success: false } };

            }

            const calculateDiscountPercent = ((existingProduct.price - reqData.discount) / existingProduct.price) * 100;

            await this.database.product.update({
                where: { id: reqData.id },
                data: { discount: calculateDiscountPercent }
            })

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, this.setDiscount.name);

        }
    }
}
