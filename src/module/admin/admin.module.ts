import { Module } from "@nestjs/common";
import { AdminUserModule } from "./user";
import { AdminAuthModule } from "./auth";
import { AdminOrderModule } from "./order";
import { RouterModule } from "@nestjs/core";
import { AdminProductModule } from "./product";
import { AdminCategoryModule } from "./category";
import { ENDPOINTS } from "@/shared/utils/consts";
import { AdminUploadModule } from "./upload/upload.module";

@Module({
    imports:[
        AdminAuthModule,
        AdminUserModule,
        AdminOrderModule,
        AdminUploadModule,
        AdminProductModule,
        AdminCategoryModule,
        RouterModule.register([
            {
                path : ENDPOINTS.auth,
                module : AdminAuthModule
            },
            {
                path : ENDPOINTS.user,
                module : AdminUserModule
            },
            {
                path : ENDPOINTS.order,
                module : AdminOrderModule
            },
            {
                path : ENDPOINTS.upload,
                module: AdminUploadModule
            },
            {
                path : ENDPOINTS.product,
                module : AdminProductModule
            },
            {
                path : ENDPOINTS.category,
                module : AdminCategoryModule
            },

        ])
    ]
})
export class AdminModule {} 