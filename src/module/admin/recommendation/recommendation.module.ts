import { Module } from "@nestjs/common";
import { ProvidersModule } from "@/shared/providers";
import { HttpModule } from "@/module/http/http.module";
import { RecommendationService } from "./recommendation.service";
import { RecommendationController } from "./recommendation.controller";

@Module({
    imports: [ProvidersModule, HttpModule],
    controllers: [RecommendationController],
    providers: [RecommendationService],
    exports: [RecommendationService]
})

export class AdminRecommendationModule {}