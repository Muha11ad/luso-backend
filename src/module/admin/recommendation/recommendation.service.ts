import { Injectable } from "@nestjs/common";
import { MyError } from "@/shared/utils/error";
import { Recommendation } from "@prisma/client";
import { DatabaseProvider } from "@/shared/providers";
import { AiService } from "@/module/http/services/ai.service";
import { RECOMMENDATION_EXCLUDED_USERS } from "@/shared/utils/consts";
import { RecommendationGeneratorReq } from "@/module/http/http.types";
import { BaseResponse, IdReq, SuccessRes } from "@/shared/utils/types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { RecommendationCreateReq, RecommendationGetAllReq } from "./recommendation.interface";

@Injectable()
export class RecommendationService {

    constructor(
        private readonly aiService: AiService,
        private readonly database: DatabaseProvider,
    ) { }

    public async getAll(reqData: RecommendationGetAllReq): Promise<BaseResponse<Recommendation[]>> {

        try {

            const recommendations = await this.database.recommendation.findMany({
                include: {
                    user: true,
                },
                orderBy: { created_at: 'desc' },
                take: reqData.pagination.limit,
                skip: reqData.pagination.offset,
            });

            const total = await this.database.recommendation.count();

            return { errId: null, data: recommendations, total };

        } catch (error) {

            return ServiceExceptions.handle(error, RecommendationService.name, this.getAll.name);

        }

    }

    public async generate(reqData: RecommendationCreateReq): Promise<BaseResponse<string>> {

        try {

            const user = await this.database.user.findUnique({ where: { telegram_id: reqData.userId } });

            if(!user) {

                return { errId: MyError.NOT_FOUND.errId , data: null };

            }

            const products = await this.database.product.findMany({
                select: {
                    id: true,
                    name: true,
                    instruction: true,
                    Characteristic: {
                        select: {
                            age: true,
                            purpose: true,
                            skin_type: true,
                            ingredients: true,
                            application_time: true,
                        }
                    }
                }
            });

            const data: RecommendationGeneratorReq = {
                ...reqData,
                products,
            }

            const aiRecommendation = await this.aiService.getRecommendation(data);

            if (aiRecommendation.errId) {

                return { errId: aiRecommendation.errId, data: null }

            }

            await this.create(reqData);

            return { errId: null, data: aiRecommendation.data };

        } catch (error) {

            return ServiceExceptions.handle(error, RecommendationService.name, this.generate.name);

        }

    }

    public async delete(reqData: IdReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.recommendation.delete({ where: { id: reqData.id } });

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, RecommendationService.name, this.delete.name);
        }

    }

    private async create(reqData: RecommendationCreateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            if (RECOMMENDATION_EXCLUDED_USERS.has(reqData.userId)) return { errId: null, data: { success: true } };

            await this.database.recommendation.create({

                data: {
                    age: reqData.age,
                    user_id: reqData.userId,
                    purpose: reqData.purpose,
                    skin_type: reqData.skinType,
                }

            });


            return { errId: null, data: { success: true } };


        } catch (error) {

            return ServiceExceptions.handle(error, RecommendationService.name, this.create.name);

        }

    }

}