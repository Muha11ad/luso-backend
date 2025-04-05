import { ReqIdDto } from "@/shared/dto";
import { IdReq } from "@/shared/utils/types";
import { CacheKey } from "@nestjs/cache-manager";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "../order/dto/pagination.dto";
import { RecommendationService } from "./recommendation.service";
import { CacheDelete } from "@/shared/decorators/cache.decorator";
import { RecommendationGetAllReq } from "./recommendation.interface";
import { handlePagination, setResult } from "@/shared/utils/helpers";
import { Controller, Delete, Get, Param, Query } from "@nestjs/common";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.recommendation)
export class RecommendationController {

    constructor(
        private readonly recommendationService: RecommendationService
    ) { }

    @Get()
    @CacheKey(REDIS_ENDPOINT_KEYS.recommendationAll)
    public async getAll(@Query() query: PaginationDto) {

        const reqData: RecommendationGetAllReq = {
            pagination: handlePagination(query),
        }

        const { errId, data, total } = await this.recommendationService.getAll(reqData);

        return setResult({ total, recommendations: data }, errId)

    }

    @Delete(':id')
    @CacheDelete(REDIS_ENDPOINT_KEYS.recommendationAll)
    async delete(@Param() param: ReqIdDto) {

        const reqData: IdReq = param

        const { errId, data } = await this.recommendationService.delete(reqData);

        return setResult({ recommenadtions: data }, errId);

    }

}