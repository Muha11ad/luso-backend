import { registerAs } from "@nestjs/config";

export default registerAs("http", () => ({
    AI_API_KEY: process.env.AI_API_KEY,
}))

export const HTTP_CONFIG_KEYS = {
    aiApiKey: 'http.AI_API_KEY',

}