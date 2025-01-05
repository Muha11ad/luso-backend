import { AuthModule } from './auth';
import { UserModule } from './user';
import { AdminModule } from './admin';
import { OrderModule } from './order';
import { Module } from '@nestjs/common';
import { ProductModule } from './product';
import { CategoryModule } from './category';
import { ConfigModule } from '@nestjs/config';
import { CommonServiceModule } from '@/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AdminModule,
    OrderModule,
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
