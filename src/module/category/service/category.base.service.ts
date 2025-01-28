import { Category } from '@prisma/client';
import { TranslationType } from '@/types';
import { CATEGORY_MESSAGE } from '../category.const';
import { DatabaseProvider, RedisProvider } from '@/common/providers';
import { NotFoundException, BadGatewayException, Injectable } from '@nestjs/common';

@Injectable()
export class CategoryBaseService {
  constructor(
    public readonly redisProvider: RedisProvider,
    public readonly database: DatabaseProvider,
  ) {}

  public async checkIdExistsAndThrowException(id: string): Promise<Category> {
    const category = await this.database.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(CATEGORY_MESSAGE.error_not_found);
    }
    return category;
  }

  public async checkNameExistsAndThrowException(name: Partial<TranslationType>): Promise<void> {
    const category = await this.database.category.findUnique({ where: { name } });
    if (category) {
      throw new BadGatewayException(CATEGORY_MESSAGE.error_name_exists);
    }
  }

  public async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
    errorMessage: string,
  ): Promise<T> {
    try {
      await this.redisProvider.delAll();
      return await operation();
    } catch (error) {
      throw new BadGatewayException(`${errorMessage}: ${error.message}`);
    }
  }
}
