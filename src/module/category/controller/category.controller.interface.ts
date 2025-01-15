import {
  CategoryCreateDto,
  CategoryUpdateDto,
  AddProductToCategoryDto,
  DeleteProductFromCategoryDto,
} from '../dto';
import { IdDto } from '@/common/dto';
import { Category } from '@prisma/client';

export interface ICategoryController {
  getCategories(): Promise<Category[]>;
  getCategoryById(id: IdDto): Promise<Category>;

  deleteCategory(id: IdDto): Promise<string>;
  createCategory(data: CategoryCreateDto): Promise<string>;
  updateCategory(id: IdDto, data: CategoryUpdateDto): Promise<string>;

  addProductToCategory(id: IdDto, data: AddProductToCategoryDto): Promise<string>;
  deleteProductFromCategory(id: IdDto, data: DeleteProductFromCategoryDto): Promise<string>;
}
