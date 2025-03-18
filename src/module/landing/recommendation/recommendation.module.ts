import { Module } from "@nestjs/common";
import { ProvidersModule } from "@/shared/providers";
import { HttpModule } from "@/module/http/http.module";
import { RecommendationController } from "./recommendation.controller";
import { RecommendationService } from "@/module/admin/recommendation/recommendation.service";

@Module({
    imports: [ProvidersModule, HttpModule],
    controllers: [RecommendationController],
    providers: [RecommendationService],
})

export class LandingRecommendationModule {}