import { Injectable } from "@nestjs/common";
import { Recommendation } from "@prisma/client";
import { DatabaseProvider } from "@/shared/providers";
import { AiService } from "@/module/http/services/ai.service";
import { BaseResponse, SuccessRes } from "@/shared/utils/types";
import { RecommendationCreateReq } from "./recommendation.interface";
import { RecommendationGeneratorReq } from "@/module/http/http.types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";

@Injectable()
export class RecommendationService {

    constructor(
        private readonly aiService: AiService,
        private readonly database: DatabaseProvider,
    ) { }

    public async getAll(): Promise<BaseResponse<Recommendation[]>> {

        try {

            const recommendations = await this.database.recommendation.findMany({
                include: {
                    user: true,
                }
            });

            return { errId: null, data: recommendations };

        } catch (error) {

            return ServiceExceptions.handle(error, RecommendationService.name, 'getAll');

        }

    }

    public async generate(reqData: RecommendationCreateReq): Promise<BaseResponse<string>> {

        try {

            const products = await this.database.product.findMany({ include: { Characteristic: true } })

            const data: RecommendationGeneratorReq = {
                ...reqData,
                products,
            }
            
            const aiRecommendation = await this.aiService.getRecommendation(data);

            if (aiRecommendation.errId) {

                return { errId: aiRecommendation.errId, data: null }

            }

            // await this.create(reqData);

            return { errId: null, data: aiRecommendation.data };

        } catch (error) {

            return ServiceExceptions.handle(error, RecommendationService.name, this.generate.name);

        }

    }

    private async create(reqData: RecommendationCreateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.user.findUniqueOrThrow({ where: { telegram_id: reqData.userId } });

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

            return ServiceExceptions.handle(error, RecommendationService.name, 'create');

        }

    }

}