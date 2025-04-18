import { INestApplication } from "@nestjs/common";
import { AdminAuthModule } from "./module/admin/auth";
import { AdminUserModule } from "./module/admin/user";
import { AdminOrderModule } from "./module/admin/order";
import { AdminUploadModule } from "./module/admin/upload";
import { LandingUserModule } from "./module/landing/user";
import { LandingOrderModule } from "./module/landing/order";
import { AdminProductModule } from "./module/admin/product";
import { AdminCategoryModule } from "./module/admin/category";
import { LandingProductModule } from "./module/landing/product";
import { LandingCategoryModule } from "./module/landing/category";
import { AdminRecommendationModule } from "./module/admin/recommendation";
import { LandingRecommendationModule } from "./module/landing/recommendation";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

export function createSwaggerDocuments(app: INestApplication): OpenAPIObject[] {

    const adminConfig = new DocumentBuilder()
        .setTitle("Admin API docs")
        .setDescription("Admin API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const staffDocument = SwaggerModule.createDocument(app, adminConfig, {
        include: [
            AdminAuthModule,
            AdminUserModule,
            AdminOrderModule,
            AdminUploadModule,
            AdminProductModule,
            AdminCategoryModule,
            AdminRecommendationModule
        ]
    });

    const landingConfig = new DocumentBuilder()
        .setTitle("Landing API docs")
        .setDescription("Landing API description")
        .setVersion("1.0")
        .build();

    const landingDocument = SwaggerModule.createDocument(app, landingConfig, {
        include: [
            LandingUserModule,
            LandingOrderModule,
            LandingProductModule,
            LandingCategoryModule,
            LandingRecommendationModule
        ]
    });

    return [staffDocument, landingDocument];

}
