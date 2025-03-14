import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HTTP_CONFIG_KEYS } from "@/configs/http.config";
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
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    }

    public async getRecommendation() {

        try {

            const promt = "hello this is my first interaction with the you via api";
            const result = await this.model.generateContent(promt)
            console.log(result.response.text());

        } catch (error) {

            return ServiceExceptions.handle(error, AiService.name, this.getRecommendation.name);

        }

    }

}