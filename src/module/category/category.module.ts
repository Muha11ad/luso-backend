import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { CommonServiceModule } from '@/common';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';

@Module({
  imports: [CommonServiceModule, AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
