import { TranslationType } from '@/types';
import { CategoryUpdateDto } from '../dto';
import { Category, Prisma } from '@prisma/client';
import { updateTranslation } from '@/common/utils';

export class CategoryUpdateEntity {
  private readonly name: TranslationType | null = null;
  private readonly description: TranslationType | null = null;

  constructor(oldData: Category, newData: CategoryUpdateDto) {
    if (newData['name']) {
      this.name = updateTranslation(oldData.name as TranslationType, newData.name);
    }
    if (newData['description']) {
      this.description = updateTranslation(
        oldData.description as TranslationType,
        newData.description,
      );
    }
  }

  toPrisma(): Prisma.CategoryUpdateInput {
    const { name, description } = this;
    return {
      ...(name && { name: name }),
      ...(description && { description: description }),
    };
  }
}
