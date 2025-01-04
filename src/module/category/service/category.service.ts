import { Category } from '@prisma/client';
import { CategoryErrorTypes } from '../types';
import { NotFoundException } from '@nestjs/common';
import { FileType, TranslationType } from '@/types';
import { CategoryCreateDto, CategoryUpdateDto } from '../dto';
import { ICategoryService } from './category.serivice.interface';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { createTranslation, updateTranslation } from '@/common/utils';
import { DatabaseService, FilesService, ImageFolderName } from '@/common/services';

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

  private async checkNameExistsAndThrowException(name: Partial<TranslationType>): Promise<void> {
    const category = await this.databaseService.category.findUnique({
      where: {
        name,
      },
    });
    if (category) {
      throw new BadGatewayException(CategoryErrorTypes.NAME_ALREADY_EXISTS);
    }
  }

  async findAll(): Promise<Category[]> {
    return this.databaseService.category.findMany();
  }

  async findById(id: string): Promise<Category> {
    return this.checkIdExistsAndThrowException(id);
  }

  async delete(id: string): Promise<Category> {
    const category = await this.checkIdExistsAndThrowException(id);
    if (category?.imageUrl)
      await this.fileService.deleteFile(category.imageUrl, ImageFolderName.category);
    try {
      return this.databaseService.category.delete({ where: { id } });
    } catch (error) {
      throw new BadGatewayException(`${CategoryErrorTypes.ERROR_DELETING}: ${error.message}`);
    }
  }

  async create(data: CategoryCreateDto): Promise<Category> {
    await this.checkNameExistsAndThrowException(data.name);
    try {
      return this.databaseService.category.create({
        data: {
          name: createTranslation(data.name),
          description: createTranslation(data.description),
        },
      });
    } catch (error) {
      throw new BadGatewayException(`${CategoryErrorTypes.ERROR_CREATING}: ${error.message}`);
    }
  }

  async update(id: string, data: CategoryUpdateDto): Promise<Category> {
    const existingCategory = await this.checkIdExistsAndThrowException(id);
    await this.checkNameExistsAndThrowException(data.name);
    try {
      return this.databaseService.category.update({
        where: { id },
        data: {
          name: updateTranslation(existingCategory.name as TranslationType, data.name),
          description: updateTranslation(
            existingCategory.description as TranslationType,
            data.description,
          ),
        },
      });
    } catch (error) {
      throw new BadGatewayException(`${CategoryErrorTypes.ERROR_UPDATING}: ${error.message}`);
    }
  }

  async saveImage(id: string, file: FileType): Promise<Category> {
    await this.checkIdExistsAndThrowException(id);
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
