import {
  ProductBaseService,
  ProductCrudService,
  ProductFindService,
  ProductImageService,
  ProductCategoryService,
} from './service';
import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { ProvidersModule } from '@/common/providers';
import { ProductController } from './controller/product.controller';
import { CharacteristicController, CharacteristicService } from './characteristic';

@Module({
  imports: [ProvidersModule, AuthModule],
  controllers: [ProductController, CharacteristicController],
  providers: [
    ProductBaseService,
    ProductCrudService,
    ProductFindService,
    ProductImageService,
    CharacteristicService,
    ProductCategoryService,
  ],
})
export class ProductModule {}
