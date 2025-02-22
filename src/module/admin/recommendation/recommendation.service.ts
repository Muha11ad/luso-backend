import { Injectable } from "@nestjs/common";
import { Recommendation } from "@prisma/client";
import { DatabaseProvider } from "@/shared/providers";
import { BaseResponse, SuccessRes } from "@/shared/utils/types";
import { RecommendationCreateReq } from "./recommendation.interface";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";

@Injectable()
export class RecommendationService {

    constructor(private readonly database: DatabaseProvider) { }

    public async getAll(): Promise<BaseResponse<Recommendation[]>> {

        try {

            const recommendations = await this.database.recommendation.findMany({
                include: {
                    user: true,
                    products: true
                }
            });

            return { errId: null, data: recommendations };

        } catch (error) {

            return ServiceExceptions.handle(error, RecommendationService.name, 'getAll');

        }

    }

    public async create(reqData: RecommendationCreateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            for (let id of reqData.products) {

                await this.database.product.findUniqueOrThrow({ where: { id } });

            }

            await this.database.user.findUniqueOrThrow({ where: { telegram_id: reqData.userId } });


            const recommendation = await this.database.recommendation.create({

                data: {
                    age: reqData.age,
                    user_id: reqData.userId,
                    purpose: reqData.purpose,
                    skin_type: reqData.skinType,
                }

            });

            if (reqData.products.length > 0) {

                await this.database.recommendationProduct.createMany({
                    data: reqData.products.map((id) => ({
                        recommendation_id: recommendation.id,
                        product_id: id
                    }))
                })
                
            }

            return { errId: null, data: { success: true } };


        } catch (error) {

            return ServiceExceptions.handle(error, RecommendationService.name, 'create');

        }

    }

}