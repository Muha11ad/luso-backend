import { AuthModule } from "../auth";
import { Module } from "@nestjs/common";
import { ProvidersModule } from "@/shared/providers";
import { ProductController } from "./product.controller";
import { CharacteristicService, CharacteristicController, } from "./characteristic";
import { ProductBaseService, ProductCrudService, ProductFindService, ProductCategoryService } from "./service";

@Module({
    imports: [ProvidersModule, AuthModule],
    controllers: [ProductController, CharacteristicController],
    providers: [ProductBaseService, ProductCrudService, ProductFindService, CharacteristicService, ProductCategoryService]
})
export class ProductModule { }
