import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance, } from "axios";
import { ConfigService } from "@nestjs/config";
import { BaseResponse } from "@/shared/utils/types";
import { HttpsProxyAgent } from "https-proxy-agent";
import { HTTP_CONFIG_KEYS } from "@/configs/http.config";
import { RecommendationGeneratorReq } from "../http.types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";

@Injectable()
export class AiService {
    private apiKey: string;
    private axiosInstance: AxiosInstance;

    constructor(private readonly configService: ConfigService) {

        this.apiKey = this.configService.get(HTTP_CONFIG_KEYS.aiApiKey);
        const proxyUrl = this.configService.get(HTTP_CONFIG_KEYS.proxyUrl);
        const proxyUsername = this.configService.get(HTTP_CONFIG_KEYS.proxyUsername);
        const proxyPassword = this.configService.get(HTTP_CONFIG_KEYS.proxyPassword);
        const agent = proxyUrl ? new HttpsProxyAgent(`http://${proxyUsername}:${proxyPassword}@${proxyUrl}`) : undefined;

        this.axiosInstance = axios.create({
            baseURL: this.configService.get(HTTP_CONFIG_KEYS.aiBaseUrl),
            httpsAgent: agent,
            auth: {
                username: proxyUsername,
                password: proxyPassword
            },
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
        });
    }

    public async getRecommendation(reqData: RecommendationGeneratorReq): Promise<BaseResponse<string>> {

        try {

            const prompt = this.recommendationPrompt(reqData);

            const response = await this.axiosInstance.post(
                `${this.configService.get(HTTP_CONFIG_KEYS.aiModel)}?key=${this.apiKey}`,
                {
                    contents: [{ parts: [{ text: prompt }] }],
                }
            );

            return { errId: null, data: response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response" };

        } catch (error) {

            return ServiceExceptions.handle(error, AiService.name, this.getRecommendation.name);

        }

    }

    private recommendationPrompt(reqData: RecommendationGeneratorReq) {
        return (
            `You are an expert cosmetologist providing tailored product recommendations.\n\n` +
            `### Client Details\n` +
            `- **Age:** ${reqData.age}\n` +
            `- **Skin Type:** ${reqData.skinType}\n` +
            `- **Purpose:** ${reqData.purpose}\n\n` +
            `### Response Guidelines\n` +
            `✅ Use structured, engaging language.\n` +
            `✅ Mention the exact product names from listed products (no translation).\n` +
            `✅ Also give general recommendation for skin care.\n` +
            `✅ Explain why it suits the client. and also include instructions\n` +
            `✅ Include emojis for a friendly tone.\n` +
            `✅ Keep it concise (90-100 words).\n\n` +
            `✅ Say that they can buy this product from our min-app nothing about link.\n\n` +
            `### Important Notes\n` +
            `- Address the client warmly and professionally.\n` +
            `- Try to recommend more than 1 product from given list\n\n` +
            `- If no suitable product is found, politely apologize and mention that the admins will be informed.\n\n` +
            `### Available Products\n` +
            `Analyze characterists, products and only recommend from the following list: ${JSON.stringify(reqData.products, null, 2)}\n` +
            `⚠️ **Do NOT suggest unlisted products!**\n\n` +
            `📝 **Reply in:** ${reqData.userLang}\n\n`
        );
    }
}
