import { Category } from '@prisma/client';
import { CategoryBaseService } from './category.base.service';

export class CategoryFindService extends CategoryBaseService {
  async findAll(): Promise<Category[]> {
    return this.databaseService.category.findMany();
  }

  async findById(id: string): Promise<Category> {
    return this.checkIdExistsAndThrowException(id);
  }
}
