import { Response } from "express";
import { ReqIdDto } from "@/shared/dto";
import { IdReq } from "@/shared/utils/types";
import { ENDPOINTS } from "@/shared/utils/consts";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "../order/dto/pagination.dto";
import { RecommendationService } from "./recommendation.service";
import { RecommendationGetAllReq } from "./recommendation.interface";
import { handlePagination, setResult } from "@/shared/utils/helpers";
import { Controller, Delete, Get, Param, Query, Res } from "@nestjs/common";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.recommendation)
export class RecommendationController {

    constructor(
        private readonly recommendationService: RecommendationService
    ) { }

    @Get()
    public async getAll(@Query() query: PaginationDto) {

        const reqData: RecommendationGetAllReq = {
            pagination: handlePagination(query),
        }

        const { errId, data, total } = await this.recommendationService.getAll(reqData);

        return setResult({ total, recommendations: data }, errId)

    }

    @Delete(':id')
    async deleteAll(@Res() res: Response, @Param() param: ReqIdDto) {

        const reqData: IdReq = param

        const { errId, data } = await this.recommendationService.delete(reqData);

        return setResult(data, errId);

    }

}