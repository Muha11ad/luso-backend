import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { ValidationPipe } from '@nestjs/common';
import { getCorsOptions } from './common/configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(getCorsOptions());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();
