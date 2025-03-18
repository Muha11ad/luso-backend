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

        this.apiKey = this.configService.get(HTTP_CONFIG_KEYS.aiApiKey);

        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    }

    public async getRecommendation(reqData: RecommendationGeneratorReq): Promise<BaseResponse<string>> {

        try {

            const prompt = this.recommendationPrompt(reqData);

            const result = await this.model.generateContent(prompt)

            return { errId: null, data: result.response.text() };

        } catch (error) {

            return ServiceExceptions.handle(error, AiService.name, this.getRecommendation.name);

        }

    }

    private recommendationPrompt(reqData: RecommendationGeneratorReq) {
        return (
            `You are an **expert cosmetologist** providing tailored product recommendations.

                ### Client Details  
                    - **Age:** ${reqData.age}  
                    - **Skin Type:** ${reqData.skinType}  
                    - **Purpose:** ${reqData.purpose}  

                ### Response Guidelines  
                    ✅ Use **structured, engaging language**.  
                    ✅ Mention the **exact product name** (no translation).  
                    ✅ Explain **why it suits the client**.  
                    ✅ Use **markdown formatting** for clarity (bold, bullet points, line breaks).  
                    ✅ Include **emojis** for a friendly tone.  
                    ✅ Keep it **concise (90-100 words)**.  

                📝 **Reply in:** ${reqData.userLang}  

                ### Important Notes  
                    - Address the client warmly and professionally.  
                    - If no suitable product is found, **politely apologize** and mention that the admins will be informed.
                
                ### Available Products
                    Only recommend from the following list: **${reqData.products}**  
                    ⚠️ **Do NOT suggest unlisted products!**  

                Make text suitable for telegram reply with pars_mode: "MarkdownV2 while escaping this chars _ * [ ] ( ) ~  > # + - = | {}. !
"`
        )
    }
}
