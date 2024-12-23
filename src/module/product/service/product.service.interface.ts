import { FilesType } from '@/types';
import { IdDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { ProductCreateDto, ProductNameTranslations, ProductUpdateDto } from '../dto';

export interface IProductService {
  findAll: () => Promise<Product[]>;
  delete: (id: IdDto) => Promise<Product>;
  findById: (id: IdDto) => Promise<Product>;
  create: (data: ProductCreateDto) => Promise<Product>;
  findByCategoryId: (categoryId: IdDto) => Promise<Product[]>;
  saveImages: (id: IdDto, files: FilesType) => Promise<Product>;
  updateImages: (id: IdDto, files: FilesType) => Promise<Product>;
  update: (id: IdDto, data: ProductUpdateDto) => Promise<Product>;
  findByName: (name: ProductNameTranslations) => Promise<Product[]>;
}
