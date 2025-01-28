import { IdDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { FilterProductsDto } from '../dto';
import { PRODUCT_MESSAGES } from '../product.consts';
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
      throw new BadRequestException(PRODUCT_MESSAGES.error_not_found);
    }
    return product;
  }

  async findByFilter(data: FilterProductsDto): Promise<Product[]> {
    const extractedAge = data.age.split('+')[0];
    const NumberAge = parseInt(extractedAge);
    return this.handleDatabaseOperation(async () => {
      const result = await this.database.product.findMany({
        where: {
          AND: [
            { Characteristic: { age: { gte: NumberAge } } },
            {
              OR: [
                { Characteristic: { skin_type: { equals: data.skin_type } } },
                { Characteristic: { skin_type: { path: ['en'], equals: 'All skin types' } } },
              ],
            },
          ],
        },
        include: {
          Characteristic: true,
          Images: true,
        },
      });
      return result;
    }, PRODUCT_MESSAGES.error_filter);
  }
}
