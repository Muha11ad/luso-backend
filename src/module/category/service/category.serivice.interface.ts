import { FileType } from '@/types';
import { Category } from '@prisma/client';
import { CategoryCreateDto, CategoryUpdateDto } from '../dto';

export interface ICategoryService {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category>;

  saveImage(id: string, file: FileType): Promise<Category>;
  updateImage(id: string, file: FileType): Promise<Category>;

  delete(id: string): Promise<Category>;
  create(data: CategoryCreateDto): Promise<Category>;
  update(id: string, data: CategoryUpdateDto): Promise<Category>;
}
