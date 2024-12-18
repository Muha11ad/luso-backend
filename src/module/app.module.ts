import { AdminModule } from './admin';
import { Module } from '@nestjs/common';
import { CategoryModule } from './category';
import { CommonServiceModule } from '@/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AdminModule,
    CategoryModule,
    CommonServiceModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
