import { CategoryCreateNameDto, CategoryUpdateNameDto } from '../dto';

export interface ICategoryController {
  getCategories(): Promise<any>;
  deleteCategory(id: string): Promise<any>;
  getCategoryById(id: string): Promise<any>;
  getCategoryByName(name: string): Promise<any>;
  createCategory(data: CategoryCreateNameDto, file: Express.Multer.File): Promise<any>;
  updateCategory(id: string, data: CategoryUpdateNameDto, file: Express.Multer.File): Promise<any>;
}
