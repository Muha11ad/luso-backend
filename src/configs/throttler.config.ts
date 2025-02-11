import { ThrottlerAsyncOptions } from "@nestjs/throttler";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis";

export const throttlerOptions : ThrottlerAsyncOptions= {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
            throttlers: [{
                ttl: config.get("rateLimit.windowMs"),
                limit: config.get("rateLimit.max")
            }],
            storage: new ThrottlerStorageRedisService({
                host: config.get("redis.host"),
                port: config.get("redis.port"),
                password: config.get("redis.password")
            })
        })
    }