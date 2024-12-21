import { FilesType } from '@/types';
import { IdDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { ProductCreateDto, ProductUpdateDto } from '../dto';

export interface IProductController {
  getAllProducts: () => Promise<Product[]>;
  deleteProduct: (id: IdDto) => Promise<Product>;
  getProductById: (id: IdDto) => Promise<Product>;
  createProduct: (data: ProductCreateDto) => Promise<Product>;
  saveImages: (id: IdDto, files: FilesType) => Promise<Product>;
  updateImages: (id: IdDto, files: FilesType) => Promise<Product>;
  getProductByCategoryId: (categoryId: IdDto) => Promise<Product[]>;
  updateProduct: (id: IdDto, data: ProductUpdateDto) => Promise<Product>;
  getProductByName: (name: Pick<ProductCreateDto, 'name'>) => Promise<Product>;
}
