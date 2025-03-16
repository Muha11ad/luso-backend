import { Injectable } from "@nestjs/common";
import { FolderName } from "@/shared/utils/enums";
import { REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { UploadService } from "../../upload/upload.service";
import { ProductBaseService } from "./product.base.service";
import { DatabaseProvider, RedisProvider } from "@/shared/providers";
import { ProductCreateEntity, ProductUpdateEntity } from "../entity";
import { BaseResponse, IdReq, SuccessRes } from "@/shared/utils/types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { ProductCreateReq, ProductDeleteImageReq, ProductUpdateReq } from "../product.interface";

@Injectable()
export class ProductCrudService extends ProductBaseService {

    constructor(
        public database: DatabaseProvider,
        public uploadService: UploadService,
        public redisProvider: RedisProvider
    ) {
        super(database, redisProvider);
    }

    public async create(reqData: ProductCreateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            const productEntity = new ProductCreateEntity(reqData);

            await this.database.product.create({

                data: productEntity.toPrisma()

            });

            await this.redisProvider.del(REDIS_ENDPOINT_KEYS.productAll);

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, 'create');

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

            await this.redisProvider.del(REDIS_ENDPOINT_KEYS.productAll);
            await this.redisProvider.del(REDIS_ENDPOINT_KEYS.productById + reqData.id);

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, 'update');

        }

    }

    public async delete(reqData: IdReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.product.delete({ where: { id: reqData.id } });

            const productImages = await this.database.productImages.findMany({ where: { product_id: reqData.id } });

            const files = productImages.map(image => image.imageUrl);

            await this.database.productImages.deleteMany({ where: { product_id: reqData.id } });

            await this.uploadService.deleteMultipleFiles({ fileNames: files, folder: FolderName.PRODUCT });

            await this.redisProvider.del(REDIS_ENDPOINT_KEYS.productAll);
            await this.redisProvider.del(REDIS_ENDPOINT_KEYS.productById + reqData)

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, 'delete');

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

            await this.redisProvider.del(REDIS_ENDPOINT_KEYS.productAll);

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductCrudService.name, this.deletProductImages.name);

        }

    }

}
