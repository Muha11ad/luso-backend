import { Category } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CategoryCreateDto, CategoryUpdateDto } from '../dto';
import { CategoryErrorTypes, CategoryNameType } from '../types';
import { ICategoryService } from './category.serivice.interface';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { DatabaseService, FilesService, ImageFolderName } from '@/common/services';
import { FileType } from '@/types';
import { ProductNameTranslations } from '@/module/product/dto';
import { InputJsonValue } from '@prisma/client/runtime/library';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    private readonly fileService: FilesService,
    private readonly databaseService: DatabaseService,
  ) {}

  private async checkIdExistsAndThrowException(id: string): Promise<Category> {
    const category = await this.databaseService.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(CategoryErrorTypes.NOT_FOUND);
    }
    return category;
  }

  private async checkNameExistsAndThrowException(name: Partial<CategoryNameType>): Promise<void> {
    const category = await this.databaseService.category.findUnique({
      where: {
        name,
      },
    });
    if (category) {
      throw new BadGatewayException(CategoryErrorTypes.NAME_ALREADY_EXISTS);
    }
  }

  async findAllCategories(): Promise<Category[]> {
    return this.databaseService.category.findMany();
  }

  async findCategoryById(id: string): Promise<Category> {
    return this.checkIdExistsAndThrowException(id);
  }

  async deleteCategory(id: string): Promise<Category> {
    const category = await this.checkIdExistsAndThrowException(id);
    if (category.imageUrl)
      await this.fileService.deleteFile(category.imageUrl, ImageFolderName.category);
    try {
      return this.databaseService.category.delete({ where: { id } });
    } catch (error) {
      throw new BadGatewayException(`${CategoryErrorTypes.ERROR_DELETING}: ${error.message}`);
    }
  }

  async createCategory(data: CategoryCreateDto): Promise<Category> {
    await this.checkNameExistsAndThrowException(data.name);
    try {
      const { uz, ru, en }: CategoryNameType = data.name;
      return this.databaseService.category.create({
        data: {
          name: {
            uz,
            ru,
            en,
          },
        },
      });
    } catch (error) {
      throw new BadGatewayException(`${CategoryErrorTypes.ERROR_CREATING}: ${error.message}`);
    }
  }

  async updateCategory(id: string, data: CategoryUpdateDto): Promise<Category> {
    const existingCategory = await this.checkIdExistsAndThrowException(id);
    await this.checkNameExistsAndThrowException(data.name);

    try {
      const updatePayload: InputJsonValue = {
        ...(existingCategory.name as object),
        ...data.name,
      };

      return this.databaseService.category.update({
        where: { id },
        data: {
          name: updatePayload,
        },
      });
    } catch (error) {
      throw new BadGatewayException(`${CategoryErrorTypes.ERROR_UPDATING}: ${error.message}`);
    }
  }

  async saveImage(id: string, file: FileType): Promise<Category> {
    const category = await this.checkIdExistsAndThrowException(id);
    try {
      const imageUrl = await this.fileService.saveFile(file, ImageFolderName.category);
      return this.databaseService.category.update({
        where: { id },
        data: { imageUrl },
      });
    } catch (error) {
      throw new BadGatewayException(`${CategoryErrorTypes.ERROR_SAVING_IMAGE}: ${error.message}`);
    }
  }

  async updateImage(id: string, file: FileType): Promise<Category> {
    const category = await this.checkIdExistsAndThrowException(id);
    try {
      await this.fileService.deleteFile(category.imageUrl, ImageFolderName.category);
      const imageUrl = await this.fileService.saveFile(file, ImageFolderName.category);
      return this.databaseService.category.update({
        where: { id },
        data: { imageUrl },
      });
    } catch (error) {
      throw new BadGatewayException(`${CategoryErrorTypes.ERROR_UPDATING_IMAGE}: ${error.message}`);
    }
  }
}
