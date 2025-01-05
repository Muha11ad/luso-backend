import {
  AddProductToCategoryDto,
  CategoryCreateDto,
  CategoryUpdateDto,
  DeleteProductFromCategoryDto,
} from '../dto';
import { FileType } from '@/types';
import { IdDto } from '@/common/dto';
import { Category } from '@prisma/client';

export interface ICategoryController {
  getCategories(): Promise<Category[]>;
  getCategoryById(id: IdDto): Promise<Category>;

  saveImage(id: IdDto, file: FileType): Promise<Category>;
  updateImage(id: IdDto, file: FileType): Promise<Category>;

  deleteCategory(id: IdDto): Promise<Category>;
  createCategory(data: CategoryCreateDto): Promise<Category>;
  updateCategory(id: IdDto, data: CategoryUpdateDto): Promise<Category>;

  addProductToCategory(id: IdDto, data: AddProductToCategoryDto): Promise<Category>;
  DeleteProductFromCategory(id: IdDto, data: DeleteProductFromCategoryDto): Promise<Category>;
}
