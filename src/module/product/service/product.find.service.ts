import { IdDto } from '@/common/dto';
import { Product } from '@prisma/client';
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

  async findByName(name: string): Promise<Product[]> {
    return this.handleDatabaseOperation(
      () =>
        this.database.product.findMany({
          where: { name: { contains: name, mode: 'insensitive' } },
          include: { Characteristic: true, Images: true, Categories: true },
        }),
      ProductExceptionErrorTypes.ERROR_FINDING_BY_NAME,
    );
  }
}
