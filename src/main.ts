import { NestFactory } from "@nestjs/core";
import { getCorsOptions } from "./configs";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./module/app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { createSwaggerDocuments } from "./swagger";
import { GlobalExceptionFilter } from "./shared/exceptions/global.exception";

async function bootstrap() {

    const app = await NestFactory.create(AppModule);
    const appConfigService = app.get(ConfigService);
    app.setGlobalPrefix("api");
    app.useGlobalFilters(new GlobalExceptionFilter())
    app.enableCors(getCorsOptions());
    app.useGlobalPipes(new ValidationPipe());

    if (true) {

        const [adminDocument, landingDocument] = createSwaggerDocuments(app);

        SwaggerModule.setup("docs-admin", app, adminDocument);
        SwaggerModule.setup("docs-landing", app, landingDocument);

    }

    await app.listen(process.env.PORT ?? 9000);

}
bootstrap();
