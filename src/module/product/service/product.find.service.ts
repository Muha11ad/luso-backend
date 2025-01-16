import { IdDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { FilterProductsDto } from '../dto';
import { ProductExceptionErrorTypes } from '../types';
import { ProductBaseService } from './product.base.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ProductFindService extends ProductBaseService {
  async findAll(): Promise<Product[]> {
    return this.database.product.findMany({
      include: { Characteristic: true, Images: true, Categories: true },
    });
  }

  async findById({ id }: IdDto): Promise<Product> {
    const product = await this.database.product.findFirst({
      where: { id },
      include: { Characteristic: true, Images: true, Categories: true },
    });
    if (!product) {
      throw new BadRequestException(ProductExceptionErrorTypes.NOT_FOUND);
    }
    return product;
  }

  async findByFilter(data: FilterProductsDto): Promise<Product[]> {
    return this.handleDatabaseOperation(async () => {
      const { age, skin_type } = data;
      const result = await this.database.characteristic.findMany({
        where: {
          OR: [
            { age },
            { age: '7-70' },
            { skin_type: { path: ['en'], equals: skin_type } },
            { skin_type: { path: ['ru'], equals: skin_type } },
            { skin_type: { path: ['uz'], equals: skin_type } },
            { skin_type: { path: ['en'], equals: 'All skin types' } },
          ],
        },
        select: {
          product: {
            include: {
              Characteristic: true,
              Images: true,
            },
          },
        },
      });
      return result.map(({ product }) => product);
    }, ProductExceptionErrorTypes.FILTER_ERROR);
  }
}
