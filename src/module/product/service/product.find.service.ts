import { Product } from '@prisma/client';
import { IdDto } from '@/common/dto';
import { BadRequestException } from '@nestjs/common';
import { ProductExceptionErrorTypes } from '../types';
import { ProductBaseService } from './product.base.service';
import { CategoryErrorTypes } from '@/module/category/types';

export class ProductFindService extends ProductBaseService {
  async findAll(): Promise<Product[]> {
    return this.database.product.findMany({ include: { Characteristic: true, Images: true } });
  }
  async findById({ id }: IdDto): Promise<Product> {
    const product = await this.database.product.findFirst({
      where: { id },
      include: { Characteristic: true, Images: true },
    });
    if (!product) {
      throw new BadRequestException(ProductExceptionErrorTypes.NOT_FOUND);
    }
    return product;
  }

  async findByName(name: string): Promise<Product[]> {
    return this.handleDatabaseOperation(
      () =>
        this.database.product.findMany({
          where: { name: { contains: name, mode: 'insensitive' } },
          include: { Characteristic: true, Images: true },
        }),
      ProductExceptionErrorTypes.ERROR_FINDING_BY_NAME,
    );
  }

  async findByCategoryName(name: string): Promise<Product[]> {
    const category = await this.database.category.findFirst({
      where: { name: { path: ['en'], equals: name } },
      select: { id: true },
    });
    if (!category) {
      throw new BadRequestException(CategoryErrorTypes.NOT_FOUND);
    }
    return this.handleDatabaseOperation(
      () =>
        this.database.product.findMany({
          where: { categories: { some: { category_id: category.id } } },
          include: { Characteristic: true, Images: true },
        }),
      ProductExceptionErrorTypes.ERROR_FINDING_BY_CATEGORY,
    );
  }
}
