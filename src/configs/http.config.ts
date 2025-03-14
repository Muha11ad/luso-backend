import { registerAs } from "@nestjs/config";

export default registerAs("http", () => ({
    geminiApiKey: process.env.GEMINI_API_KEY,
}))

export const HTTP_CONFIG_KEYS = {
    geminiApiKey: 'http.geminiApiKey',
}