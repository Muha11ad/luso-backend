import { Category } from '@prisma/client';
import { CategoryCreateType, CategoryUpdateType } from '../dto';

export interface ICategoryService {
  findAllCategories(): Promise<Category[]>;
  deleteCategory(id: string): Promise<Category>;
  findCategoryById(id: string): Promise<Category>;
  findCategoryByName(name: string): Promise<Category>;
  createCategory({ name, file }: CategoryCreateType): Promise<Category>;
  updateCategory(id: string, category: CategoryUpdateType): Promise<Category>;
}
