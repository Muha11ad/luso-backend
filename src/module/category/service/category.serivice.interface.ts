import { FileType } from '@/types';
import { Category } from '@prisma/client';
import { CategoryCreateDto, CategoryUpdateDto } from '../dto';

export interface ICategoryService {
  findAllCategories(): Promise<Category[]>;
  deleteCategory(id: string): Promise<Category>;
  findCategoryById(id: string): Promise<Category>;
  saveImage(id: string, file: FileType): Promise<Category>;
  updateImage(id: string, file: FileType): Promise<Category>;
  createCategory(data: CategoryCreateDto): Promise<Category>;
  updateCategory(id: string, data: CategoryUpdateDto): Promise<Category>;
}
