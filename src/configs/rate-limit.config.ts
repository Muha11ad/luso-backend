import { registerAs } from "@nestjs/config";

export default registerAs("rateLimit", () => ({
    max: Number(process.env.RATE_LIMIT_MAX) // dynamic
}))