import {
  CategoryBaseService,
  CategoryCrudService,
  CategoryFindService,
  CategoryProductService,
} from './service';
import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { CategoryController } from './controller';
import { ProvidersModule } from '@/common/providers';

@Module({
  imports: [ProvidersModule, AuthModule],
  controllers: [CategoryController],
  providers: [
    CategoryBaseService,
    CategoryCrudService,
    CategoryFindService,
    CategoryProductService,
  ],
})
export class CategoryModule {}
