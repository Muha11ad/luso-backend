import { Category } from '@prisma/client';
import { CategoryErrorTypes } from '../types';
import { FileType, TranslationType } from '@/types';
import { ICategoryService } from './category.serivice.interface';
import { ProductExceptionErrorTypes } from '@/module/product/types';
import { createTranslation, updateTranslation } from '@/common/utils';
import { DatabaseService, FilesService, ImageFolderName } from '@/common/services';
import { NotFoundException, BadGatewayException, Injectable } from '@nestjs/common';
import { AddProductToCategoryDto, CategoryCreateDto, CategoryUpdateDto } from '../dto';

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
    const category = await this.databaseService.category.findUnique({ where: { name } });
    if (category) {
      throw new BadGatewayException(CategoryErrorTypes.NAME_ALREADY_EXISTS);
    }
  }

  private async handleDatabaseOperation<T>(operation: () => Promise<T>, errorMessage: string): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw new BadGatewayException(`${errorMessage}: ${error.message}`);
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
    if (category?.imageUrl) {
      await this.fileService.deleteFile(category.imageUrl, ImageFolderName.category);
    }
    return this.handleDatabaseOperation(
      () => this.databaseService.category.delete({ where: { id } }),
      CategoryErrorTypes.ERROR_DELETING
    );
  }

  async create(data: CategoryCreateDto): Promise<Category> {
    await this.checkNameExistsAndThrowException(data.name);
    return this.handleDatabaseOperation(
      () => this.databaseService.category.create({
        data: {
          name: createTranslation(data.name),
          description: createTranslation(data.description),
        },
      }),
      CategoryErrorTypes.ERROR_CREATING
    );
  }

  async update(id: string, data: CategoryUpdateDto): Promise<Category> {
    const existingCategory = await this.checkIdExistsAndThrowException(id);
    await this.checkNameExistsAndThrowException(data.name);
    return this.handleDatabaseOperation(
      () => this.databaseService.category.update({
        where: { id },
        data: {
          name: updateTranslation(existingCategory.name as TranslationType, data.name),
          description: updateTranslation(existingCategory.description as TranslationType, data.description),
        },
      }),
      CategoryErrorTypes.ERROR_UPDATING
    );
  }

  async addProductToCategory(id: string, data: AddProductToCategoryDto): Promise<Category> {
    const category = await this.checkIdExistsAndThrowException(id);
    for (const p_id of data.productIds) {
      const product = await this.databaseService.product.findUnique({ where: { id: p_id } });
      if (!product) {
        throw new NotFoundException(ProductExceptionErrorTypes.NOT_FOUND);
      }
    }
    await this.handleDatabaseOperation(
      () => this.databaseService.productCategory.createMany({
        data: data.productIds.map((p_id) => ({
          product_id: p_id,
          category_id: id,
        })),
      }),
      CategoryErrorTypes.ERROR_ADDING_PRODUCT
    );
    return category;
  }

  async saveImage(id: string, file: FileType): Promise<Category> {
    await this.checkIdExistsAndThrowException(id);
    const imageUrl = await this.fileService.saveFile(file, ImageFolderName.category);
    return this.handleDatabaseOperation(
      () => this.databaseService.category.update({
        where: { id },
        data: { imageUrl },
      }),
      CategoryErrorTypes.ERROR_SAVING_IMAGE
    );
  }

  async updateImage(id: string, file: FileType): Promise<Category> {
    const category = await this.checkIdExistsAndThrowException(id);
    await this.fileService.deleteFile(category.imageUrl, ImageFolderName.category);
    const imageUrl = await this.fileService.saveFile(file, ImageFolderName.category);
    return this.handleDatabaseOperation(
      () => this.databaseService.category.update({
        where: { id },
        data: { imageUrl },
      }),
      CategoryErrorTypes.ERROR_UPDATING_IMAGE
    );
  }
}
