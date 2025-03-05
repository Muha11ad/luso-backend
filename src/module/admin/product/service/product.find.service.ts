import { Product } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { ProductsFilterReq } from "../product.interface";
import { BaseResponse, IdReq } from "@/shared/utils/types";
import { ProductBaseService } from "./product.base.service";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";

@Injectable()
export class ProductFindService extends ProductBaseService {

    public async findAll(): Promise<BaseResponse<Product[]>> {

        try {

            const cachedProducts: Product[] | null = await this.redisProvider.get(REDIS_ENDPOINT_KEYS.productAll);

            if (cachedProducts) {

                return { errId: null, data: cachedProducts };

            }

            const products = await this.database.product.findMany({
                include: { Characteristic: true, Images: true, Categories: true }
            });

            await this.redisProvider.set(REDIS_ENDPOINT_KEYS.productAll, products);

            return { errId: null, data: products };


        } catch (error) {

            return ServiceExceptions.handle(error, ProductFindService.name, 'findAll');

        }

    }

    public async findById(reqData: IdReq): Promise<BaseResponse<Product>> {

        try {

            const cachedProduct: Product | null = await this.redisProvider.get(REDIS_ENDPOINT_KEYS.productById + reqData.id);

            if (cachedProduct) {

                await this.database.product.update({ where: { id: reqData.id }, data: { views: cachedProduct.views + 1 } });

                return { errId: null, data: cachedProduct };

            }

            const product = await this.database.product.findFirstOrThrow({
                where: { id: reqData.id },
                include: { Characteristic: true, Images: true, Categories: true }
            });

            await this.database.product.update({ where: { id: reqData.id }, data: { views: product.views + 1 } });

            await this.redisProvider.set(REDIS_ENDPOINT_KEYS.productById + reqData.id, product);

            return { errId: null, data: product };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductFindService.name, 'findById');

        }

    }

    public async findByFilter(reqData: ProductsFilterReq): Promise<BaseResponse<Product[]>> {

        try {

            const extractedAge = reqData.age.split("+")[0];
            const numberedAge = parseInt(extractedAge);

            const result = await this.database.product.findMany({
                where: {
                    AND: [
                        { Characteristic: { age: { lte: numberedAge } } },
                        {
                            OR: [
                                // get specific skin type
                                { Characteristic: { skin_type: { equals: reqData.skinType } } },
                                // add all skin types
                                {
                                    Characteristic: {
                                        skin_type: { path: ["en"], equals: "All skin types" }
                                    }
                                },
                                // match purpose in any language
                                {
                                    Characteristic: {
                                        OR: [
                                            { purpose: { path: ["uz"], string_contains: reqData.purpose } },
                                            { purpose: { path: ["ru"], string_contains: reqData.purpose } },
                                            { purpose: { path: ["en"], string_contains: reqData.purpose } }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                },
                include: {
                    Characteristic: true,
                    Images: true,
                    Categories: true
                }
            });

            return { errId: null, data: result };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductFindService.name, 'findByFilter');

        }

    }

}
