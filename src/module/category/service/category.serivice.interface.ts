import { Category } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from '../';

export interface ICategoryService {
  findAllCategories(): Promise<Category[]>;
  deleteCategory(id: string): Promise<Category>;
  findCategoryById(id: string): Promise<Category>;
  findCategoryByName(name: string): Promise<Category>;
  createCategory(category: CreateCategoryDto): Promise<Category>;
  updateCategory(id: string, category: UpdateCategoryDto): Promise<Category>;
}
