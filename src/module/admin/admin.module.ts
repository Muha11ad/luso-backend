import { Module } from "@nestjs/common";
import { AdminUserModule } from "./user";
import { AdminOrderModule } from "./order";
import { AdminUploadModule } from "./upload";
import { AdminProductModule } from "./product";
import { AdminCategoryModule } from "./category";
import { ENDPOINTS } from "@/shared/utils/consts";
import { AdminAuthModule, AuthGuard } from "./auth";
import { APP_GUARD, RouterModule } from "@nestjs/core";

@Module({
    imports: [
        AdminAuthModule,
        AdminUserModule,
        AdminOrderModule,
        AdminUploadModule,
        AdminProductModule,
        AdminCategoryModule,
        RouterModule.register([
            {
                path: ENDPOINTS.auth,
                module: AdminAuthModule
            },
            {
                path: ENDPOINTS.user,
                module: AdminUserModule
            },
            {
                path: ENDPOINTS.order,
                module: AdminOrderModule
            },
            {
                path: ENDPOINTS.upload,
                module: AdminUploadModule
            },
            {
                path: ENDPOINTS.product,
                module: AdminProductModule
            },
            {
                path: ENDPOINTS.category,
                module: AdminCategoryModule
            },

        ])
    ],
    providers: [{ provide: APP_GUARD, useClass: AuthGuard }]
})
export class AdminModule { } 