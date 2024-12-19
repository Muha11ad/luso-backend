import { AuthGuard } from '../auth';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CommonServiceModule } from '@/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './service/category.service';

@Module({
  imports: [CommonServiceModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class CategoryModule {}
