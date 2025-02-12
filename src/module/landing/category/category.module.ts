import { Module } from "@nestjs/common";
import { ProvidersModule } from "@/shared/providers";
import { CategoryController } from "./category.controller";
import { CategoryFindService } from "@/module/admin/category/service";

@Module({
    imports: [ProvidersModule],
    controllers: [CategoryController],
    providers: [CategoryFindService]
})
export class LandingCategoryModule { }
