import { registerAs } from "@nestjs/config";

export default registerAs("http", () => ({
    GROQ_API_KEY: process.env.GROQ_API_KEY,
}))

export const HTTP_CONFIG_KEYS = {
    groqApiKey: 'http.GROQ_API_KEY',

}