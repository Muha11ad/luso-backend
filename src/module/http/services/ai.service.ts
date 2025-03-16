import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseResponse } from "@/shared/utils/types";
import { HTTP_CONFIG_KEYS } from "@/configs/http.config";
import { RecommendationGeneratorReq } from "../http.types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class AiService {

    private apiKey: string;
    private model: GenerativeModel;
    private genAI: GoogleGenerativeAI;

    constructor(private readonly configService: ConfigService) {

        this.apiKey = this.configService.get(HTTP_CONFIG_KEYS.geminiApiKey);

        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    }

    public async getRecommendation(reqData: RecommendationGeneratorReq): Promise<BaseResponse<string>> {

        try {

            const prompt = this.recommedationPromt(reqData);

            const result = await this.model.generateContent(prompt)

            return { errId: null , data: result.response.text() };

        } catch (error) {

            return ServiceExceptions.handle(error, AiService.name, this.getRecommendation.name);

        }

    }

    private recommedationPromt(reqData: RecommendationGeneratorReq) {

        return 'Imagine you are professional comsetologist and you are giving a recommendation to a client with the following age: ' 
        + reqData.age 
        + ' and the following skin type: ' 
        + reqData.skinType + 
        ' and the following purpose: ' 
        + reqData.purpose 
        + ' Give structured, creative response, just send product original name (without translatin it) and the reason for the recommendation. within 90-100 words include emojies, in language : ' 
        + reqData.userLang
        + ' Analyze the following products and recommend only from them !!! : ' 
        + reqData.products
        + " If not product is suitable, appologise for client, and say that you will inform us (admins) about that , CHOOSE ONLY FROM GIVEN PRODUCTS";

    }

}