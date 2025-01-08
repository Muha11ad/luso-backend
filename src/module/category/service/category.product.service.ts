import { Category } from '@prisma/client';
import { CategoryErrorTypes } from '../types';
import { AddProductToCategoryDto } from '../dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryBaseService } from './category.base.service';
import { ProductExceptionErrorTypes } from '@/module/product/types';

@Injectable()
export class CategoryProductService extends CategoryBaseService {
  private async checkCategoryAndProductsExist(id: string, productIds: string[]): Promise<Category> {
    const category = await this.checkIdExistsAndThrowException(id);
    for (const p_id of productIds) {
      const product = await this.databaseService.product.findUnique({ where: { id: p_id } });
      if (!product) {
        throw new NotFoundException(ProductExceptionErrorTypes.NOT_FOUND);
      }
    }
    return category;
  }

  private async filterDuplicateProductInCategory(
    id: string,
    data: AddProductToCategoryDto,
  ): Promise<string[]> {
    const existingProductIds: string[] = await this.databaseService.productCategory
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
    const category = await this.databaseService.category.findUnique({ where: { id: category_id } });
    if (!category) {
      throw new NotFoundException(CategoryErrorTypes.NOT_FOUND);
    }
    const product = await this.databaseService.product.findUnique({ where: { id: product_id } });
    if (!product) {
      throw new NotFoundException(ProductExceptionErrorTypes.NOT_FOUND);
    }
    return category;
  }

  public async addProductToCategory(id: string, data: AddProductToCategoryDto): Promise<Category> {
    const category = await this.checkCategoryAndProductsExist(id, data.productIds);
    const newProductIds = await this.filterDuplicateProductInCategory(id, data);
    if (newProductIds.length > 0) {
      await this.handleDatabaseOperation(
        () =>
          this.databaseService.productCategory.createMany({
            data: newProductIds.map((p_id) => ({
              product_id: p_id,
              category_id: id,
            })),
          }),
        CategoryErrorTypes.ERROR_ADDING_PRODUCT,
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
        this.databaseService.productCategory.delete({
          where: {
            product_id_category_id: {
              category_id,
              product_id,
            },
          },
        }),
      CategoryErrorTypes.ERROR_DELETING_PRODUCT_FROM_CATEGORY,
    );
    return category;
  }

  public async findProductByCategoryId(id: string): Promise<any> {
    await this.checkIdExistsAndThrowException(id);
    return this.databaseService.productCategory.findMany({
      where: { category_id: id },
      select: {
        category: true,
        product: {
          include: { Images: true, Characteristic: true },
        },
      },
    });
  }
}
