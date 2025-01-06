import { Product } from '@prisma/client';
import { ExceptionErrorTypes } from '@/types';
import { CategoryErrorTypes } from '@/module/category/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService, FilesService, RedisService } from '@/common/services';

@Injectable()
export class ProductBaseService {
  constructor(
    public database: DatabaseService,
    public redisService: RedisService,
    public filesService: FilesService,
  ) {}

  public async checkNameExists(name: string): Promise<void> {
    const nameExists = await this.database.product.findUnique({ where: { name } });
    if (nameExists) {
      throw new BadRequestException(ExceptionErrorTypes.ALREADY_EXISTS);
    }
  }

  public async getProductById(id: string): Promise<Product> {
    const product = await this.database.product.findFirst({
      where: { id },
      include: { Categories: true },
    });
    if (!product) {
      throw new BadRequestException(CategoryErrorTypes.NOT_FOUND);
    }
    return product;
  }

  public async checkCategoryExists(category_id: string): Promise<void> {
    const categoryExists = await this.database.category.findFirst({ where: { id: category_id } });
    if (!categoryExists) {
      throw new BadRequestException(CategoryErrorTypes.NOT_FOUND);
    }
  }

  public async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
    errorType: string,
    rollback?: () => Promise<void>,
  ): Promise<T> {
    try {
      await this.redisService.delAll();
      return await operation();
    } catch (error) {
      if (rollback) {
        await rollback();
      }
      throw new BadRequestException(`${errorType}: ${error.message}`);
    }
  }
}
