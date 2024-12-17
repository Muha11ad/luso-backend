import { ErrorTypes } from '@/types';
import { Category } from '@prisma/client';
import { DatabaseService } from '@/module/database';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ICategoryService } from './category.serivice.interface';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(private readonly databaseService: DatabaseService) {}
  async findAllCategories(): Promise<Category[]> {
    return this.databaseService.category.findMany();
  }

  async deleteCategory(id: string): Promise<Category> {
    const category = await this.databaseService.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(ErrorTypes.NOT_FOUND);
    }
    return this.databaseService.category.delete({ where: { id } });
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.databaseService.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(ErrorTypes.NOT_FOUND);
    }
    return category;
  }

  async findCategoryByName(name: string): Promise<Category> {
    const category = await this.databaseService.category.findUnique({ where: { name } });
    if (!category) {
      throw new NotFoundException(ErrorTypes.NOT_FOUND);
    }
    return category;
  }

  async createCategory(categoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.databaseService.category.findUnique({
      where: { name: categoryDto.name },
    });
    if (existingCategory !== null) {
      throw new BadRequestException(ErrorTypes.ALREADY_EXISTS);
    }
    try {
      return this.databaseService.category.create({ data: categoryDto });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadGatewayException(`Failed to create category: ${error.message}`);
    }
  }

  async updateCategory(id: string, categoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.databaseService.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(ErrorTypes.NOT_FOUND);
    }
    const existingCategory = await this.databaseService.category.findUnique({
      where: { name: categoryDto.name },
    });
    if (existingCategory && existingCategory.id !== id) {
      throw new ConflictException(ErrorTypes.ALREADY_EXISTS);
    }
    return this.databaseService.category.update({ where: { id }, data: categoryDto });
  }
}
