import { registerAs } from "@nestjs/config";

export default registerAs("http", () => ({
    aiModel: process.env.AI_MODEL,
    proxyUrl: process.env.PROXY_URL,
    aiApiKey: process.env.AI_API_KEY,
    aiBaseUrl: process.env.AI_BASE_URL,
    proxyUsername: process.env.PROXY_USERNAME,
    proxyPassword: process.env.PROXY_PASSWORD,
}))

export const HTTP_CONFIG_KEYS = {
    aiModel: 'http.aiModel',
    aiApiKey: 'http.aiApiKey',
    proxyUrl: 'http.proxyUrl',
    aiBaseUrl: 'http.aiBaseUrl',
    proxyUsername: 'http.proxyUsername',
    proxyPassword: 'http.proxyPassword',
}