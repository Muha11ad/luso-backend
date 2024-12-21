import { Category } from '@prisma/client';
import { FileType } from '@/types';

export interface ICategoryService {
  findAllCategories(): Promise<Category[]>;
  deleteCategory(id: string): Promise<Category>;
  findCategoryById(id: string): Promise<Category>;
  createCategory(name: string): Promise<Category>;
  findCategoryByName(name: string): Promise<Category>;
  uploadImage(id: string, file: FileType): Promise<Category>;
  updateCategory(id: string, name: string): Promise<Category>;
}
