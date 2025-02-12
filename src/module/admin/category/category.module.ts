import { Module } from "@nestjs/common";
import { ProvidersModule } from "@/shared/providers";
import { CategoryController } from "./category.controller";
import { CategoryBaseService, CategoryCrudService, CategoryFindService, CategoryProductService } from "./service";

@Module({
    imports: [ProvidersModule],
    controllers: [CategoryController],
    providers: [CategoryBaseService, CategoryCrudService, CategoryFindService, CategoryProductService]
})
export class AdminCategoryModule { }
