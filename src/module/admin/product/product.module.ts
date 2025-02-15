import { Module } from "@nestjs/common";
import { AdminUploadModule } from "../upload";
import { ProvidersModule } from "@/shared/providers";
import { ProductController } from "./product.controller";
import { CharacteristicService, CharacteristicController, } from "./characteristic";
import { ProductBaseService, ProductCrudService, ProductFindService, ProductCategoryService } from "./service";

@Module({
    imports: [ProvidersModule, AdminUploadModule],
    controllers: [ProductController, CharacteristicController],
    providers: [ProductBaseService, ProductCrudService, ProductFindService, CharacteristicService, ProductCategoryService],
    exports: [ProductCategoryService, ProductFindService]
})
export class AdminProductModule { }
