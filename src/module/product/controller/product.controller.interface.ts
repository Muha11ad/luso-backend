import { FilesType } from '@/types';
import { IdDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { ProductCreateDto, ProductUpdateDto } from '../dto';

export interface IProductController {
  delete: (id: IdDto) => Promise<string>;
  getAllProducts: () => Promise<Product[]>;
  getProductById: (id: IdDto) => Promise<Product>;
  getProductByName: (name: string) => Promise<Product[]>;
  getProductByCategoryId: (categoryId: IdDto) => Promise<Product[]>;
  createProduct: (data: ProductCreateDto, files: FilesType) => Promise<Product>;
  update: (id: IdDto, data: ProductUpdateDto, files: FilesType) => Promise<Product>;
}
