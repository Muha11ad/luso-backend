import { UserModule } from "./user";
import { AuthModule } from "./auth";
import { OrderModule } from "./order";
import { Module } from "@nestjs/common";
import { ProductModule } from "./product";
import { CategoryModule } from "./category";
import { RouterModule } from "@nestjs/core";
import { ENDPOINTS } from "@/shared/utils/consts";

@Module({
    imports:[
        AuthModule,
        UserModule,
        OrderModule,
        ProductModule,
        CategoryModule,
        RouterModule.register([
            {
                path : ENDPOINTS.product,
                module : ProductModule
            },
            {
                path : ENDPOINTS.category,
                module : CategoryModule
            },
            {
                path : ENDPOINTS.order,
                module : OrderModule
            },
            {
                path : ENDPOINTS.user,
                module : UserModule
            },

        ])
    ]
})
export class AdminModule {} 