import { FilesType } from '@/types';
import { IdDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { ProductCreateDto, ProductUpdateDto } from '../dto';

export interface IProductService {
  findAll: () => Promise<Product[]>;
  delete: (id: IdDto) => Promise<Product>;
  findById: (id: IdDto) => Promise<Product>;
  findByName: (name: string) => Promise<Product[]>;
  findByCategoryId: (CategoryId: IdDto) => Promise<Product[]>;
  create: (data: ProductCreateDto, files: FilesType) => Promise<Product>;
  update: (id: IdDto, data: ProductUpdateDto, files?: FilesType) => Promise<Product>;
}
