import { ApiTags } from "@nestjs/swagger";
import { Public } from "@/shared/decorators";
import { setResult } from "@/shared/utils/helpers";
import { Body, Controller, Post } from "@nestjs/common";
import { CacheDelete } from "@/shared/decorators/cache.decorator";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { CreateRecommendationDto } from "@/module/admin/recommendation/dto";
import { RecommendationService } from "@/module/admin/recommendation/recommendation.service";
import { RecommendationCreateReq } from "@/module/admin/recommendation/recommendation.interface";

@Public()
@Controller()
@ApiTags(ENDPOINTS.recommendation)
export class RecommendationController {

    constructor(
        private readonly recommendationService: RecommendationService
    ) { }

    @Post('generate')
    @CacheDelete(REDIS_ENDPOINT_KEYS.recommendationAll)
    public async generate(@Body() body: CreateRecommendationDto) {

        const reqData: RecommendationCreateReq = body;

        const { errId, data } = await this.recommendationService.generate(reqData);

        return setResult({ recommendations: data }, errId)

    }

}