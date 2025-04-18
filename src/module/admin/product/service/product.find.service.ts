import { Product } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { BaseResponse, IdReq } from "@/shared/utils/types";
import { ProductsFilterReq } from "../product.interface";
import { ProductBaseService } from "./product.base.service";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";

@Injectable()
export class ProductFindService extends ProductBaseService {

    public async findAll(): Promise<BaseResponse<Product[]>> {

        try {

            const products = await this.database.product.findMany({

                include: { Characteristic: true, Images: true, Categories: true },

            });

            const total = await this.database.product.count({});

            return { errId: null, data: products, total };


        } catch (error) {

            return ServiceExceptions.handle(error, ProductFindService.name, this.findAll.name);

        }

    }

    public async findById(reqData: IdReq): Promise<BaseResponse<Product>> {

        try {


            const product = await this.database.product.findFirstOrThrow({
                where: { id: reqData.id },
                include: { Characteristic: true, Images: true, Categories: true }
            });

            await this.database.product.update({ where: { id: reqData.id }, data: { views: product.views + 1 } });

            return { errId: null, data: product };

        } catch (error) {

            return ServiceExceptions.handle(error, ProductFindService.name, this.findById.name);

        }

    }

    // do not need maybe for now
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
