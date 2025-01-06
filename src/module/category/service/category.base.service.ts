import { Category } from '@prisma/client';
import { TranslationType } from '@/types';
import { CategoryErrorTypes } from '../types';
import { DatabaseService, FilesService, RedisService } from '@/common/services';
import { NotFoundException, BadGatewayException, Injectable } from '@nestjs/common';

@Injectable()
export class CategoryBaseService {
  constructor(
    public readonly fileService: FilesService,
    public readonly redisService: RedisService,
    public readonly databaseService: DatabaseService,
  ) {}

  public async checkIdExistsAndThrowException(id: string): Promise<Category> {
    const category = await this.databaseService.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(CategoryErrorTypes.NOT_FOUND);
    }
    return category;
  }

  public async checkNameExistsAndThrowException(name: Partial<TranslationType>): Promise<void> {
    const category = await this.databaseService.category.findUnique({ where: { name } });
    if (category) {
      throw new BadGatewayException(CategoryErrorTypes.NAME_ALREADY_EXISTS);
    }
  }

  public async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
    errorMessage: string,
    id?: string | undefined,
  ): Promise<T> {
    try {
      if (id) {
        await this.redisService.del(`/api/category/${id}`);
      }
      await this.redisService.del('/api/category');
      return await operation();
    } catch (error) {
      throw new BadGatewayException(`${errorMessage}: ${error.message}`);
    }
  }
}
