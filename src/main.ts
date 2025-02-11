import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module/app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { getCorsOptions } from "./configs";
import { createSwaggerDocuments } from "./swagger";

async function bootstrap() {

    const app = await NestFactory.create(AppModule);
    const appConfigService = app.get(ConfigService);
    app.setGlobalPrefix("api");
    app.enableCors(getCorsOptions());
    app.useGlobalPipes(new ValidationPipe());

    if (true) {

        const [landingDocument, adminDocument] = createSwaggerDocuments(app);

        SwaggerModule.setup("docs-admin", app, adminDocument);
        SwaggerModule.setup("docs-landing", app, landingDocument);
    
    }

    await app.listen(process.env.PORT ?? 9000);

}
bootstrap();
