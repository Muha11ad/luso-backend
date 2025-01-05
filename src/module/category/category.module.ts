import {
  CategoryBaseService,
  CategoryCrudService,
  CategoryFindService,
  CategoryImageService,
  CategoryProductService,
} from './service';
import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { CommonServiceModule } from '@/common';
import { CategoryController } from './controller';

@Module({
  imports: [CommonServiceModule, AuthModule],
  controllers: [CategoryController],
  providers: [
    CategoryBaseService,
    CategoryCrudService,
    CategoryImageService,
    CategoryFindService,
    CategoryProductService,
  ],
})
export class CategoryModule {}
