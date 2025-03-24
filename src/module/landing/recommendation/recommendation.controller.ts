import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "@/shared/decorators";
import { setResult } from "@/shared/utils/helpers";
import { ENDPOINTS } from "@/shared/utils/consts";
import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { CreateRecommendationDto } from "@/module/admin/recommendation/dto";
import { RecommendationService } from "@/module/admin/recommendation/recommendation.service";
import { RecommendationCreateReq } from "@/module/admin/recommendation/recommendation.interface";

@Controller()
@ApiTags(ENDPOINTS.recommendation)
@Public()
export class RecommendationController {

    constructor(
        private readonly recommendationService: RecommendationService
    ) { }

    @Post('generate')
    public async generate(@Res() res: Response, @Body() body: CreateRecommendationDto) {

        const reqData: RecommendationCreateReq = body;

        const { errId, data } = await this.recommendationService.generate(reqData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        return res.status(HttpStatus.CREATED).json(setResult(data, null));

    }

}