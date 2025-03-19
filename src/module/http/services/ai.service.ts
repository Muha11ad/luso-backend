import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseResponse } from "@/shared/utils/types";
import { HTTP_CONFIG_KEYS } from "@/configs/http.config";
import { RecommendationGeneratorReq } from "../http.types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import axios, { AxiosInstance, isAxiosError } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

@Injectable()
export class AiService {
    private apiKey: string;
    private axiosInstance: AxiosInstance;

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get(HTTP_CONFIG_KEYS.aiApiKey);

        const proxyUrl = this.configService.get(HTTP_CONFIG_KEYS.proxyUrl);
        const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

        this.axiosInstance = axios.create({
            baseURL: "https://generativelanguage.googleapis.com",
            httpsAgent: agent,
            auth: {
                username: "vefjfxoe",
                password: "u35scaps8q94",
            },
            headers: {
                Authorization: `Bearer ${this.apiKey}`, // Ensure correct auth
                "Content-Type": "application/json",
            },
        });
    }

    public async getRecommendation(reqData: RecommendationGeneratorReq): Promise<BaseResponse<string>> {
        try {
            const prompt = this.recommendationPrompt(reqData);

            const response = await this.axiosInstance.post(
                `/v1/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
                {
                    contents: [{ parts: [{ text: prompt }] }],
                }
            );

            return { errId: null, data: response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response" };
        } catch (error) {
            if (isAxiosError(error)) {
                console.error("Axios Error:", error.message);
                console.error("Response Data:", error.response ? error.response.data : "No Response");
            }
            console.error("Error in getRecommendation:", error);
            return ServiceExceptions.handle(error, AiService.name, this.getRecommendation.name);
        }
    }

    private recommendationPrompt(reqData: RecommendationGeneratorReq) {
        return (
            `You are an **expert cosmetologist** providing tailored product recommendations.\n\n` +
            `### Client Details\n` +
            `- **Age:** ${reqData.age}\n` +
            `- **Skin Type:** ${reqData.skinType}\n` +
            `- **Purpose:** ${reqData.purpose}\n\n` +
            `### Response Guidelines\n` +
            `✅ Use **structured, engaging language**.\n` +
            `✅ Mention the **exact product name** (no translation).\n` +
            `✅ Explain **why it suits the client**.\n` +
            `✅ Use **markdown formatting** for clarity (bold, bullet points, line breaks).\n` +
            `✅ Include **emojis** for a friendly tone.\n` +
            `✅ Keep it **concise (90-100 words)**.\n\n` +
            `📝 **Reply in:** ${reqData.userLang}\n\n` +
            `### Important Notes\n` +
            `- Address the client warmly and professionally.\n` +
            `- If no suitable product is found, **politely apologize** and mention that the admins will be informed.\n\n` +
            `### Available Products\n` +
            `Only recommend from the following list: **${reqData.products}**\n` +
            `⚠️ **Do NOT suggest unlisted products!**\n\n` +
            `Make text suitable for telegram reply with pars_mode: "MarkdownV2 while escaping this chars _ * [ ] ( ) ~ > # + - = | {}. !`
        );
    }
}
