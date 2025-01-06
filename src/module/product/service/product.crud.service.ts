import { Product } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ProductExceptionErrorTypes } from '../types';
import { ProductCreateDto, ProductUpdateDto } from '../dto';
import { ProductBaseService } from './product.base.service';
import { ProductCreateEntity, ProductUpdateEntity } from '../entity';

@Injectable()
export class ProductCrudService extends ProductBaseService {
  public async create(data: ProductCreateDto): Promise<Product> {
    await this.checkNameExists(data.name);
    const newProduct = new ProductCreateEntity(data);
    return this.handleDatabaseOperation(
      () => this.database.product.create({ data: newProduct.toPrisma() }),
      ProductExceptionErrorTypes.ERROR_CREATING,
    );
  }

  public async update(id: string, data: ProductUpdateDto): Promise<Product> {
    if (data['name']) {
      await this.checkNameExists(data.name);
    }
    const existingProduct = await this.getProductById(id);
    const newData = new ProductUpdateEntity(existingProduct, data);
    return await this.handleDatabaseOperation(
      async () =>
        await this.database.product.update({
          where: { id },
          data: newData.toPrisma(),
        }),
      ProductExceptionErrorTypes.ERROR_UPDATING,
    );
  }

  public async delete(id: string): Promise<Product> {
    await this.getProductById(id);
    return this.handleDatabaseOperation(
      async () => await this.database.product.delete({ where: { id } }),
      ProductExceptionErrorTypes.ERROR_DELETING,
    );
  }
}
