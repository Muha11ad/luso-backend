import { AuthModule } from "../auth";
import { Module } from "@nestjs/common";
import { ProvidersModule } from "@/shared/providers";
import { CategoryController } from "./category.controller";
import { CategoryBaseService, CategoryCrudService, CategoryFindService, CategoryProductService } from "./service";

@Module({
    imports: [ProvidersModule, AuthModule],
    controllers: [CategoryController],
    providers: [CategoryBaseService, CategoryCrudService, CategoryFindService, CategoryProductService]
})
export class CategoryModule { }
