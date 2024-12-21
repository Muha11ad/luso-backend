import { FileType } from '@/types';
import { IdDto } from '@/common/dto';
import { Category } from '@prisma/client';
import { CategoryCreateDto, CategoryUpdateDto } from '../dto';

export interface ICategoryController {
  getCategories(): Promise<Category[]>;
  deleteCategory(id: IdDto): Promise<Category>;
  getCategoryById(id: IdDto): Promise<Category>;
  getCategoryByName(name: string): Promise<Category>;
  uploadImage(id: IdDto, file: FileType): Promise<Category>;
  createCategory(data: CategoryCreateDto): Promise<Category>;
  updateCategory(id: IdDto, data: CategoryUpdateDto): Promise<Category>;
}
