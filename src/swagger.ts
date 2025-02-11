import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

export function createSwaggerDocuments(app: INestApplication): OpenAPIObject[] {

    const adminConfig = new DocumentBuilder()
        .setTitle("Admin API docs")
        .setDescription("Admin API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const staffDocument = SwaggerModule.createDocument(app, adminConfig, {
        include: []
    });

    const landingConfig = new DocumentBuilder()
        .setTitle("Landing API docs")
        .setDescription("Landing API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const landingDocument = SwaggerModule.createDocument(app, landingConfig, {
        include: []
    });

    return [staffDocument, landingDocument];

}
