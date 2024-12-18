import { Module } from '@nestjs/common';
import { CommonServiceModule } from '@/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './service/category.service';

@Module({
  imports: [CommonServiceModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
