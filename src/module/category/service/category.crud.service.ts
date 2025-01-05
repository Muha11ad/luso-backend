import { Category } from '@prisma/client';
import { TranslationType } from '@/types';
import { CategoryErrorTypes } from '../types';
import { ImageFolderName } from '@/common/services';
import { CategoryCreateDto, CategoryUpdateDto } from '../dto';
import { CategoryBaseService } from './category.base.service';
import { createTranslation, updateTranslation } from '@/common/utils';

export class CategoryCrudService extends CategoryBaseService {
  async delete(id: string): Promise<Category> {
    const category = await this.checkIdExistsAndThrowException(id);
    if (category?.imageUrl) {
      await this.fileService.deleteFile(category.imageUrl, ImageFolderName.category);
    }
    return this.handleDatabaseOperation(
      () => this.databaseService.category.delete({ where: { id } }),
      CategoryErrorTypes.ERROR_DELETING,
    );
  }

  async create(data: CategoryCreateDto): Promise<Category> {
    await this.checkNameExistsAndThrowException(data.name);
    return this.handleDatabaseOperation(
      () =>
        this.databaseService.category.create({
          data: {
            name: createTranslation(data.name),
            description: createTranslation(data.description),
          },
        }),
      CategoryErrorTypes.ERROR_CREATING,
    );
  }

  async update(id: string, data: CategoryUpdateDto): Promise<Category> {
    const existingCategory = await this.checkIdExistsAndThrowException(id);
    await this.checkNameExistsAndThrowException(data.name);
    return this.handleDatabaseOperation(
      () =>
        this.databaseService.category.update({
          where: { id },
          data: {
            name: updateTranslation(existingCategory.name as TranslationType, data.name),
            description: updateTranslation(
              existingCategory.description as TranslationType,
              data.description,
            ),
          },
        }),
      CategoryErrorTypes.ERROR_UPDATING,
    );
  }
}
