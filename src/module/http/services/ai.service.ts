import OpenAI from "openai";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseResponse } from "@/shared/utils/types";
import { HTTP_CONFIG_KEYS } from "@/configs/http.config";
import { RecommendationGeneratorReq } from "../http.types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

@Injectable()
export class AiService {

    private apiKey: string;
    private model: string;
    private openai: OpenAI;

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get(HTTP_CONFIG_KEYS.aiApiKey);
        this.model = "qwen2.5-72b-instruct";
        this.openai = new OpenAI({
            apiKey: this.apiKey,
            baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
        });
    }

    public async getRecommendation(reqData: RecommendationGeneratorReq): Promise<BaseResponse<string>> {
        try {
            const response = await this.openai.chat.completions.create({
                messages: this.recommendationPrompt(reqData),
                model: this.model,
            });

            console.log(response);
            console.log(response.choices[0]?.message);

            return { errId: null, data: response.choices[0]?.message?.content || "" };

        } catch (error) {
            return ServiceExceptions.handle(error, AiService.name, this.getRecommendation.name);
        }
    }

    private recommendationPrompt(reqData: RecommendationGeneratorReq): ChatCompletionMessageParam[] {
        return [
            {
                role: "system",
                content: "You are an expert cosmetologist. Provide concise, engaging product recommendations."
            },
            {
                role: "user",
                content: `
Client details:
- <b>Age:</b> ${reqData.age}
- <b>Skin Type:</b> ${reqData.skinType}
- <b>Purpose:</b> ${reqData.purpose}

Only choose from these products: <b>${reqData.products.join(", ")}</b>  
Do NOT recommend any unlisted products !!!

<b>Response Guidelines:</b>
✅ Use structured, engaging language.  
✅ Provide the <b>exact product name</b> (no translation).  
✅ Explain why it suits the client.  
✅ Use <b>HTML formatting</b> (bold text, line breaks).  
✅ Include emojis for a friendly tone.  
✅ Keep it <b>concise (90-100 words)</b>.  

Reply in: <b>${reqData.userLang}</b>.

Do NOT recommend any unlisted products !!!

Treat as dear client.

If no product is suitable from the given list, politely apologize and mention that admins will be informed.
`
            }
        ];
    }
}
