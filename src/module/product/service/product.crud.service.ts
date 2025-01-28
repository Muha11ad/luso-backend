import { Product } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PRODUCT_MESSAGES } from '../product.consts';
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
      PRODUCT_MESSAGES.error_create,
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
      PRODUCT_MESSAGES.error_update,
    );
  }

  public async delete(id: string): Promise<Product> {
    await this.getProductById(id);
    return this.handleDatabaseOperation(
      async () => await this.database.product.delete({ where: { id } }),
      PRODUCT_MESSAGES.error_delete,
    );
  }
}
