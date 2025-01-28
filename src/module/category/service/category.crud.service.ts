import { Category } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CATEGORY_MESSAGE } from '../category.const';
import { CategoryCreateDto, CategoryUpdateDto } from '../dto';
import { CategoryBaseService } from './category.base.service';
import { CategoryCreateEntity, CategoryUpdateEntity } from '../entity';

@Injectable()
export class CategoryCrudService extends CategoryBaseService {
  async delete(id: string): Promise<Category> {
    await this.checkIdExistsAndThrowException(id);
    return this.handleDatabaseOperation(
      () => this.database.category.delete({ where: { id } }),
      CATEGORY_MESSAGE.error_delete,
    );
  }

  async create(data: CategoryCreateDto): Promise<Category> {
    await this.checkNameExistsAndThrowException(data.name);
    const categoryEntity = new CategoryCreateEntity(data);
    return this.handleDatabaseOperation(
      () =>
        this.database.category.create({
          data: categoryEntity.toPrisma(),
        }),
      CATEGORY_MESSAGE.error_create,
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
        this.database.category.update({
          where: { id },
          data: newData.toPrisma(),
        }),
      CATEGORY_MESSAGE.error_update,
    );
  }
}
