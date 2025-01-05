import { IdDto } from '@/common/dto';
import { TranslationType } from '@/types';
import { Product, Prisma } from '@prisma/client';
import { ProductExceptionErrorTypes } from '../types';
import { ProductCreateDto, ProductUpdateDto } from '../dto';
import { ProductBaseService } from './product.base.service';
import { createTranslation, updateTranslation } from '@/common/utils';

export class ProductCrudService extends ProductBaseService {
  private buildUpdateData(
    existingProduct: Product,
    data: ProductUpdateDto,
  ): Prisma.ProductUpdateInput {
    return {
      ...(data.name && { name: data.name }),
      ...(data.price && { price: data.price }),
      ...(data.available && { available: data.available }),
      ...(data.instruction && {
        instruction: updateTranslation(
          existingProduct.instruction as TranslationType,
          data.instruction,
        ),
      }),
    };
  }

  public async create(data: ProductCreateDto): Promise<Product> {
    await this.checkNameExists(data.name);
    const productData = {
      name: data.name,
      price: data.price,
      available: data.available,
      instruction: createTranslation(data.instruction),
    };
    return this.handleDatabaseOperation(
      () => this.database.product.create({ data: productData }),
      ProductExceptionErrorTypes.ERROR_CREATING,
    );
  }

  public async update({ id }: IdDto, data: ProductUpdateDto): Promise<Product> {
    if (data.name) {
      await this.checkNameExists(data.name);
    }
    const existingProduct = await this.getProductById(id);
    const newData = this.buildUpdateData(existingProduct, data);
    return this.handleDatabaseOperation(
      () =>
        this.database.product.update({ where: { id }, data: newData as Prisma.ProductUpdateInput }),
      ProductExceptionErrorTypes.ERROR_UPDATING,
    );
  }

  public async delete({ id }: IdDto): Promise<Product> {
    await this.getProductById(id);
    return this.handleDatabaseOperation(
      () => this.database.product.delete({ where: { id } }),
      ProductExceptionErrorTypes.ERROR_DELETING,
    );
  }
}
