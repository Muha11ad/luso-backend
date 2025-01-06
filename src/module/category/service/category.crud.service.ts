import { Category } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CategoryErrorTypes } from '../types';
import { ImageFolderName } from '@/common/services';
import { CategoryCreateDto, CategoryUpdateDto } from '../dto';
import { CategoryBaseService } from './category.base.service';
import { CategoryCreateEntity, CategoryUpdateEntity } from '../entity';

@Injectable()
export class CategoryCrudService extends CategoryBaseService {
  async delete(id: string): Promise<Category> {
    const category = await this.checkIdExistsAndThrowException(id);
    if (category?.imageUrl) {
      await this.fileService.deleteFile(category.imageUrl, ImageFolderName.category);
    }
    return this.handleDatabaseOperation(
      () => this.databaseService.category.delete({ where: { id } }),
      CategoryErrorTypes.ERROR_DELETING,
      id,
    );
  }

  async create(data: CategoryCreateDto): Promise<Category> {
    await this.checkNameExistsAndThrowException(data.name);
    const categoryEntity = new CategoryCreateEntity(data);
    return this.handleDatabaseOperation(
      () =>
        this.databaseService.category.create({
          data: categoryEntity.toPrisma(),
        }),
      CategoryErrorTypes.ERROR_CREATING,
    );
  }

  async update(id: string, data: CategoryUpdateDto): Promise<Category> {
    const existingCategory = await this.checkIdExistsAndThrowException(id);
    if (data['name']) {
      await this.checkNameExistsAndThrowException(data.name);
    }
    const newData = new CategoryUpdateEntity(existingCategory, data);
    return this.handleDatabaseOperation(
      () =>
        this.databaseService.category.update({
          where: { id },
          data: newData.toPrisma(),
        }),
      CategoryErrorTypes.ERROR_UPDATING,
      id,
    );
  }
}
