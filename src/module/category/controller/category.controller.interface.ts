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

  saveImage(id: IdDto, file: FileType): Promise<string>;
  updateImage(id: IdDto, file: FileType): Promise<string>;

  deleteCategory(id: IdDto): Promise<string>;
  createCategory(data: CategoryCreateDto): Promise<string>;
  updateCategory(id: IdDto, data: CategoryUpdateDto): Promise<string>;

  addProductToCategory(id: IdDto, data: AddProductToCategoryDto): Promise<string>;
  DeleteProductFromCategory(id: IdDto, data: DeleteProductFromCategoryDto): Promise<string>;
}
