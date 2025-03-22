import { redisStore } from "cache-manager-redis-store";
import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService, registerAs } from "@nestjs/config";

export default registerAs("redis", () => ({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    reset: Number(process.env.REDIS_CLEAR_TTL),
}))

const REDIS_CONFIG_KEYS = {
    host: "redis.host",
    port: "redis.port",
    reset: "redis.reset",
    password: "redis.password",
}

export const redisOptions: CacheModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (config: ConfigService) => {

        try {

            const store = await redisStore({
                socket: {
                    host: config.get(REDIS_CONFIG_KEYS.host),
                    port: config.get(REDIS_CONFIG_KEYS.port),
                }
            });

            return {
                store,
                ttl: config.get(REDIS_CONFIG_KEYS.reset),
            };
    
        } catch (error) {

            throw error;
    
        }
  
    },
    inject: [ConfigService]
};
