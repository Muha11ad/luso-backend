import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisProvider } from "./redis.provider";
import { CacheModule } from "@nestjs/cache-manager";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { DatabaseProvider } from "./database.provider";
import { jwtOptions, redisOptions } from "../../configs";

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync(jwtOptions),
        CacheModule.registerAsync(redisOptions)
    ],
    providers: [DatabaseProvider, RedisProvider, JwtService],
    exports: [
        JwtService,
        CacheModule,
        RedisProvider,
        DatabaseProvider,
    ]
})
export class ProvidersModule {}
