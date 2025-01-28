import { Product } from '@prisma/client';
import { PRODUCT_MESSAGES } from '../product.consts';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseProvider, FilesProvider, RedisProvider } from '@/common/providers';

@Injectable()
export class ProductBaseService {
  constructor(
    public database: DatabaseProvider,
    public redisProvider: RedisProvider,
    public filesProvider: FilesProvider,
  ) {}

  public async checkNameExists(name: string): Promise<void> {
    const nameExists = await this.database.product.findUnique({ where: { name } });
    if (nameExists) {
      throw new BadRequestException(PRODUCT_MESSAGES.error_name_exists);
    }
  }

  public async getProductById(id: string): Promise<Product> {
    const product = await this.database.product.findFirst({
      where: { id },
      include: { Categories: true },
    });
    if (!product) {
      throw new BadRequestException(PRODUCT_MESSAGES.error_not_found);
    }
    return product;
  }

  public async checkCategoryExists(category_id: string): Promise<void> {
    const categoryExists = await this.database.category.findFirst({ where: { id: category_id } });
    if (!categoryExists) {
      throw new BadRequestException(PRODUCT_MESSAGES.error_category_not_found);
    }
  }

  public async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
    errorType: string,
  ): Promise<T> {
    try {
      const result = await operation();
      await this.redisProvider.delAll();
      return result;
    } catch (error) {
      throw new BadRequestException(`${errorType}: ${error.message}`);
    }
  }
}
