import { Product } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { AddCategoryToProductDto } from '../dto';
import { PRODUCT_MESSAGES } from '../product.consts';
import { ProductBaseService } from './product.base.service';

@Injectable()
export class ProductCategoryService extends ProductBaseService {
  public async addCategoryToProduct(
    product_id: string,
    data: AddCategoryToProductDto,
  ): Promise<Product> {
    await Promise.all(data.categoryIds.map(this.checkCategoryExists.bind(this)));
    const product = await this.getProductById(product_id);
    await this.handleDatabaseOperation(
      () =>
        this.database.productCategory.createMany({
          data: data.categoryIds.map((c_id: string) => ({ category_id: c_id, product_id })),
        }),
      PRODUCT_MESSAGES.error_category_adding_to_product,
    );
    return product;
  }

  public async deleteCategoryFromProduct(
    product_id: string,
    category_id: string,
  ): Promise<Product> {
    await this.checkCategoryExists(category_id);
    const product = await this.getProductById(product_id);
    await this.handleDatabaseOperation(
      () =>
        this.database.productCategory.deleteMany({
          where: { category_id, product_id },
        }),
      PRODUCT_MESSAGES.error_category_deleting_from_product,
    );
    return product;
  }
}
