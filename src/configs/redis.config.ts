import { redisStore } from "cache-manager-redis-store";
import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService, registerAs } from "@nestjs/config";

export default registerAs("redis", () => ({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    reset: Number(process.env.REDIS_CLEAR_TTL),
}))

export const redisOptions: CacheModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (config: ConfigService) => {

        try {

            const store = await redisStore({
                socket: {
                    host: config.get("redis.host"),
                    port: config.get("redis.port"),
                }
            });

            return {
                store,
                ttl: config.get("redis.reset")
            };
    
        } catch (error) {

            console.error("Error connecting to Redis:", error);
            throw error;
    
        }
  
    },
    inject: [ConfigService]
};
