import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { CommonServiceModule } from '@/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';

@Module({
  imports: [CommonServiceModule, AuthModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
