import { Category } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CategoryBaseService } from './category.base.service';

@Injectable()
export class CategoryFindService extends CategoryBaseService {
  async findAll(): Promise<Category[]> {
    return this.database.category.findMany();
  }

  async findById(id: string): Promise<Category> {
    return this.database.category.findUnique({
      where: {
        id,
      },
    });
  }
}
