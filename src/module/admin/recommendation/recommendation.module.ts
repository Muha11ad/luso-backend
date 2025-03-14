import { Module } from "@nestjs/common";
import { ProvidersModule } from "@/shared/providers";
import { RecommendationService } from "./recommendation.service";
import { RecommendationController } from "./recommendation.controller";
import { HttpModule } from "@/module/http/http.module";

@Module({
    imports: [ProvidersModule, HttpModule],
    controllers: [RecommendationController],
    providers: [RecommendationService],
})

export class AdminRecommendationModule {}