import { AdminModule } from './admin';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CategoryModule } from './category';
import { ConfigModule } from '@nestjs/config';
import { CommonServiceModule } from '@/common';
import { AuthGuard, AuthModule } from './auth';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule,
    AdminModule,
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
