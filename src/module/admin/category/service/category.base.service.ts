import { Category } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { MyError } from '@/shared/utils/error';
import { BaseResponse, TranslationType } from '@/shared/utils/types';
import { DatabaseProvider, RedisProvider } from '@/shared/providers';

@Injectable()
export class CategoryBaseService {
  constructor(
    public readonly redisProvider: RedisProvider,
    public readonly database: DatabaseProvider,
  ) { }

  public async checkName(name: Partial<TranslationType>): Promise<BaseResponse<Category>> {
    const category = await this.database.category.findUnique({
      where: { name },
    });
    if (category) {
      return { errId: MyError.UNIQUE_CONSTRAINT_FAILED.errId, data: null };
    }
    return { errId: null, data: category };
  }
}
