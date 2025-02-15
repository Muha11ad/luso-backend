import { Module } from "@nestjs/common";
import { AdminUserModule } from "./user";
import { AdminAuthModule } from "./auth";
import { AdminOrderModule } from "./order";
import { AdminUploadModule } from "./upload";
import { AdminProductModule } from "./product";
import { AdminCategoryModule } from "./category";
import { ENDPOINTS } from "@/shared/utils/consts";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { ProvidersModule } from "@/shared/providers";
import { AuthGuard } from "@/shared/guards/auth.guard";

@Module({
    imports: [
        ProvidersModule,
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