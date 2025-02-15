import { Module } from "@nestjs/common";
import { ProvidersModule } from "@/shared/providers";
import { RecommendationService } from "./recommendation.service";
import { RecommendationController } from "./recommendation.controller";

@Module({
    imports: [ProvidersModule],
    controllers: [RecommendationController],
    providers: [RecommendationService],
})

export class AdminRecommendationModule {}