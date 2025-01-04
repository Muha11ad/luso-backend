import { FileType } from '@/types';
import { IdDto } from '@/common/dto';
import { Category } from '@prisma/client';
import { CategoryCreateDto, CategoryUpdateDto } from '../dto';

export interface ICategoryController {
  getCategories(): Promise<Category[]>;
  getCategoryById(id: IdDto): Promise<Category>;

  saveImage(id: IdDto, file: FileType): Promise<Category>;
  updateImage(id: IdDto, file: FileType): Promise<Category>;

  deleteCategory(id: IdDto): Promise<Category>;
  createCategory(data: CategoryCreateDto): Promise<Category>;
  updateCategory(id: IdDto, data: CategoryUpdateDto): Promise<Category>;
}
