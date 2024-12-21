import { AdminModule } from './admin';
import { Module } from '@nestjs/common';
import { CategoryModule } from './category';
import { ConfigModule } from '@nestjs/config';
import { CommonServiceModule } from '@/common';
import { AuthGuard, AuthModule } from './auth';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    ProductModule,
    CategoryModule,
    CommonServiceModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
