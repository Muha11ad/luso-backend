import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { RedisProvider } from "./redis.provider";
import { CacheModule } from "@nestjs/cache-manager";
import { DatabaseProvider } from "./database.provider";
import { jwtOptions, redisOptions } from "../../configs";

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync(jwtOptions),
        CacheModule.registerAsync(redisOptions)
    ],
    providers: [DatabaseProvider, RedisProvider],
    exports: [
        JwtModule,
        CacheModule,
        RedisProvider,
        DatabaseProvider,
    ]
})
export class ProvidersModule {}
