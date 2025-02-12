import { Module } from "@nestjs/common";
import jwtConfig from "@/configs/jwt.config";
import { ConfigModule } from "@nestjs/config";
import appConfigs from "@/configs/app.configs";
import fileConfig from "@/configs/file.config";
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
                redisConfig,
                rateLimitConfig,
            ],
            validationSchema: configSchema
         }),
        ThrottlerModule.forRootAsync(throttlerOptions),
        AdminModule,
        LandingModule,
    ]
})
export class AppModule {}
