import { Response } from "express";
import { CreateRecommendationDto } from "./dto";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AiService } from "@/module/http/services/ai.service";
import { RecommendationService } from "./recommendation.service";
import { RecommendationCreateReq } from "./recommendation.interface";
import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.recommendation)
export class RecommendationController {

    constructor(
        private readonly aiService: AiService,
        private readonly recommendationService: RecommendationService
    ) { }

    @Get()
    public async getAll(@Res() res: Response) {

        const { errId, data } = await this.recommendationService.getAll();

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).json(setResult(null, errId));

        }

        await this.aiService.getRecommendation();

        return res.status(HttpStatus.OK).json(setResult(data, null));

    }

    @Post()
    public async create(@Res() res: Response, @Body() body: CreateRecommendationDto) {

        const requestDate: RecommendationCreateReq = body;

        const { errId, data } = await this.recommendationService.create(requestDate);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).json(setResult(null, errId));

        }

        return res.status(HttpStatus.CREATED).json(setResult(data, null));

    }

}