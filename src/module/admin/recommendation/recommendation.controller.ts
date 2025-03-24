import { Response } from "express";
import { ReqIdDto } from "@/shared/dto";
import { IdReq } from "@/shared/utils/types";
import { CreateRecommendationDto } from "./dto";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RecommendationService } from "./recommendation.service";
import { RecommendationCreateReq } from "./recommendation.interface";
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res } from "@nestjs/common";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.recommendation)
export class RecommendationController {

    constructor(
        private readonly recommendationService: RecommendationService
    ) { }

    @Get()
    public async getAll(@Res() res: Response) {

        const { errId, data } = await this.recommendationService.getAll();

        if (errId) return res.status(HttpStatus.BAD_REQUEST).json(setResult(null, errId));

        return res.status(HttpStatus.OK).json(setResult(data, null));

    }

    @Post('generate')
    public async generate(@Res() res: Response, @Body() body: CreateRecommendationDto) {

        const reqData: RecommendationCreateReq = body;

        const { errId, data } = await this.recommendationService.generate(reqData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).json(setResult(null, errId));

        return res.status(HttpStatus.CREATED).json(setResult(data, null));

    }

    @Delete(':id')
    async deleteAll(@Res() res: Response, @Param() param: ReqIdDto) {

        const reqData: IdReq = param

        const { errId, data } = await this.recommendationService.delete(reqData);

        if (errId) return res.status(HttpStatus.BAD_REQUEST).json(setResult(null, errId));

        return res.status(HttpStatus.OK).json(setResult(data, null));

    }

}