import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { LandingUserModule } from "../user";
import { LandingOrderModule } from "./order";
import { LandingProductModule } from "./product";
import { ENDPOINTS } from "@/shared/utils/consts";
import { LandingCategoryModule } from "./category";

@Module({
    imports:[
        LandingUserModule,
        LandingOrderModule,
        LandingProductModule,
        LandingCategoryModule,
        RouterModule.register([
            {
                path : ENDPOINTS.user,
                module : LandingUserModule
            },
            {
                path : ENDPOINTS.order,
                module : LandingOrderModule
            },
            {
                path : ENDPOINTS.product,
                module : LandingProductModule
            },
            {
                path : ENDPOINTS.category,
                module : LandingCategoryModule
            },
        ])
        
    ]
})
export class LandingModule {}