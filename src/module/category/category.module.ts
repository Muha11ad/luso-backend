import {
  CategoryBaseService,
  CategoryCrudService,
  CategoryFindService,
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
    CategoryFindService,
    CategoryProductService,
  ],
})
export class CategoryModule {}
