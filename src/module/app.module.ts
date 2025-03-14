import { Module } from "@nestjs/common";
import jwtConfig from "@/configs/jwt.config";
import { ConfigModule } from "@nestjs/config";
import appConfigs from "@/configs/app.configs";
import httpConfig from "@/configs/http.config";
import fileConfig from "@/configs/file.config";
import { HttpModule } from "./http/http.module";
import redisConfig from "@/configs/redis.config";
import { AdminModule } from "./admin/admin.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { configSchema } from "@/configs/config.schema";
import { LandingModule } from "./landing/landing.module";
import rateLimitConfig from "@/configs/rate-limit.config";
import { throttlerOptions } from "@/configs/throttler.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                jwtConfig,
                appConfigs,
                fileConfig,
                httpConfig,
                redisConfig,
                rateLimitConfig,
            ],
            validationSchema: configSchema
        }),
        ThrottlerModule.forRootAsync(throttlerOptions),
        HttpModule,
        AdminModule,
        LandingModule
    ]
})
export class AppModule { }
