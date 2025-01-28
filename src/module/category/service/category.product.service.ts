import { AddProductToCategoryDto } from '../dto';
import { Category, Product } from '@prisma/client';
import { CATEGORY_MESSAGE } from '../category.const';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryBaseService } from './category.base.service';

@Injectable()
export class CategoryProductService extends CategoryBaseService {
  private async checkCategoryAndProductsExist(id: string, productIds: string[]): Promise<Category> {
    const category = await this.checkIdExistsAndThrowException(id);
    for (const p_id of productIds) {
      const product = await this.database.product.findUnique({ where: { id: p_id } });
      if (!product) {
        throw new NotFoundException(CATEGORY_MESSAGE.error_product_not_found);
      }
    }
    return category;
  }

  private async filterDuplicateProductInCategory(
    id: string,
    data: AddProductToCategoryDto,
  ): Promise<string[]> {
    const existingProductIds: string[] = await this.database.productCategory
      .findMany({
        where: {
          category_id: id,
          product_id: { in: data.productIds },
        },
        select: { product_id: true },
      })
      .then((products) => products.map((product) => product.product_id));

    return data.productIds.filter((p_id) => !existingProductIds.includes(p_id));
  }

  private async checkCategoryAndProductExist(
    category_id: string,
    product_id: string,
  ): Promise<Category> {
    const category = await this.database.category.findUnique({ where: { id: category_id } });
    if (!category) {
      throw new NotFoundException(CATEGORY_MESSAGE.error_not_found);
    }
    const product = await this.database.product.findUnique({ where: { id: product_id } });
    if (!product) {
      throw new NotFoundException(CATEGORY_MESSAGE.error_product_not_found);
    }
    return category;
  }

  public async addProductToCategory(id: string, data: AddProductToCategoryDto): Promise<Category> {
    const category = await this.checkCategoryAndProductsExist(id, data.productIds);
    const newProductIds = await this.filterDuplicateProductInCategory(id, data);
    if (newProductIds.length > 0) {
      await this.handleDatabaseOperation(
        () =>
          this.database.productCategory.createMany({
            data: newProductIds.map((p_id) => ({
              product_id: p_id,
              category_id: id,
            })),
          }),
        CATEGORY_MESSAGE.error_add_product,
      );
    }
    return category;
  }

  public async deleteProductFromCategory(
    category_id: string,
    product_id: string,
  ): Promise<Category> {
    const category = await this.checkCategoryAndProductExist(category_id, product_id);
    await this.handleDatabaseOperation(
      () =>
        this.database.productCategory.delete({
          where: {
            product_id_category_id: {
              category_id,
              product_id,
            },
          },
        }),
      CATEGORY_MESSAGE.error_delete_product,
    );
    return category;
  }

  public async findProductByCategoryId(
    id: string,
  ): Promise<{ category: Category; products: Product[] }> {
    const category = await this.checkIdExistsAndThrowException(id);
    const products = await this.database.productCategory.findMany({
      where: { category_id: id },
      select: {
        product: {
          include: { Images: true, Characteristic: true },
        },
      },
    });
    return { category, products: products.map((product) => product.product) };
  }
}
