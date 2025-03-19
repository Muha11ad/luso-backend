import { registerAs } from "@nestjs/config";

export default registerAs("http", () => ({
    aiApiKey: process.env.AI_API_KEY,
    proxyUrl: process.env.PROXY_URL,

}))

export const HTTP_CONFIG_KEYS = {
    aiApiKey: 'http.aiApiKey',
    proxyUrl: 'http.proxyUrl',
}