import { Category } from '@prisma/client';
import { ExceptionErrorTypes } from '@/types';
import { CategoryCreateType, CategoryUpdateType } from '../dto';
import { ICategoryService } from './category.serivice.interface';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService, FilesService, ImageFolderName } from '@/common/services';
import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    private readonly fileService: FilesService,
    private readonly databaseService: DatabaseService,
  ) {}
  async findAllCategories(): Promise<Category[]> {
    return this.databaseService.category.findMany();
  }

  async deleteCategory(id: string): Promise<Category> {
    const category = await this.databaseService.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(ExceptionErrorTypes.NOT_FOUND);
    }
    await this.fileService.deleteFile(category.imageUrl, ImageFolderName.category);
    return this.databaseService.category.delete({ where: { id } });
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.databaseService.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(ExceptionErrorTypes.NOT_FOUND);
    }
    return category;
  }

  async findCategoryByName(name: string): Promise<Category> {
    const category = await this.databaseService.category.findUnique({ where: { name } });
    if (!category) {
      throw new NotFoundException(ExceptionErrorTypes.NOT_FOUND);
    }
    return category;
  }

  async createCategory({ name, file }: CategoryCreateType): Promise<Category> {
    const existingCategory = await this.databaseService.category.findUnique({
      where: { name },
    });
    if (existingCategory !== null) {
      throw new BadRequestException(ExceptionErrorTypes.ALREADY_EXISTS);
    }
    try {
      const fileUrl = await this.fileService.saveFile(file, ImageFolderName.category);
      const newCategory = { name, imageUrl: fileUrl };
      return this.databaseService.category.create({ data: newCategory });
    } catch (error) {
      throw new BadGatewayException(`Failed to create category: ${error.message}`);
    }
  }

  async updateCategory(id: string, { name, file }: CategoryUpdateType): Promise<Category> {
    const category = await this.databaseService.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(ExceptionErrorTypes.NOT_FOUND);
    }
    const categoryDto = {};
    if (name) {
      const existingCategory = await this.databaseService.category.findUnique({
        where: { name },
      });
      if (existingCategory) {
        throw new ConflictException(ExceptionErrorTypes.ALREADY_EXISTS);
      } else {
        categoryDto['name'] = name;
      }
    }
    try {
      if (file) {
        const fileUrl = await this.fileService.updateFile(
          file,
          ImageFolderName.category,
          category.imageUrl,
        );
        categoryDto['imageUrl'] = fileUrl;
      }
      return this.databaseService.category.update({ where: { id }, data: categoryDto });
    } catch (error) {
      throw new BadGatewayException(`Failed to update category: ${error.message}`);
    }
  }
}
