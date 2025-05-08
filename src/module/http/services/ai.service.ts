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
    }r

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
            `- <b>Age:</b> ${reqData.age}\n` +
            `- <b>Skin Type:</b> ${reqData.skinType}\n` +
            `- <b>Purpose:</b> ${reqData.purpose}\n\n` +

            `### Response Guidelines\n` +
            `✅ Write in Telegram-supported HTML using only these tags: <b>, <i>, <u>, <s>, <code>, <pre>, <a>, <tg-spoiler>.\n` +
            `✅ Recommend only from the provided list.\n` +
            `✅ List products clearly and briefly, without unnecessary words.\n` +
            `✅ Explain why each product fits the client’s needs (1 sentence).\n` +
            `✅ Include short usage instructions.\n` +
            `✅ Add emojis to make it friendly.\n` +
            `✅ Total response should be ~90–100 words.\n\n` +

            `### Purchase Note\n` +
            `You can buy the recommended products from our mini-app. Do not include external links.\n\n` +

            `### Available Products\n` +
            `${JSON.stringify(reqData.products, null, 2)}\n\n` +

            `### HTML Link Template\n` +
            `Use this format for each product link:\n` +
            `<a href="https://t.me/luso_cosmetics_bot/hello?startapp=product_hereproductId">Product Name</a>\n\n` +

            `📝 <b>Reply in:</b> ${reqData.userLang}\n`
        );
    }
}
