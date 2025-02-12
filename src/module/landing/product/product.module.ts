import { Module } from "@nestjs/common";
import { ProvidersModule } from "@/shared/providers";
import { ProductController } from "./product.controller";
import { ProductCategoryService, ProductFindService } from "@/module/admin/product/service";

@Module({
    imports: [ProvidersModule],
    controllers: [ProductController,],
    providers: [ProductCategoryService, ProductFindService]
})
export class LandingProductModule { }
