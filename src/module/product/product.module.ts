import {
  ProductBaseService,
  ProductCategoryService,
  ProductCrudService,
  ProductFindService,
  ProductImageService,
} from './service';
import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { CommonServiceModule } from '@/common';
import { ProductController } from './controller/product.controller';
import { CharacteristicController, CharacteristicService } from './characteristic';

@Module({
  imports: [CommonServiceModule, AuthModule],
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
