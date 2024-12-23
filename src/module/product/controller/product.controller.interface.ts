import { IdDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { ParamsImageDto, ProductCreateDto, ProductUpdateDto } from '../dto';
import { FilesType, FileType } from '@/types';

export interface IProductController {
  getAllProducts: () => Promise<Product[]>;
  deleteProduct: (id: IdDto) => Promise<Product>;
  getProductById: (id: IdDto) => Promise<Product>;
  createProduct: (data: ProductCreateDto) => Promise<Product>;
  getProductByCategoryId: (categoryId: IdDto) => Promise<Product[]>;
  updateProduct: (id: IdDto, data: ProductUpdateDto) => Promise<Product>;
  getProductByName: (name: string) => Promise<Product>;

  deleteImage: (params: ParamsImageDto) => Promise<Product>;
  saveImages: (id: IdDto, files: FilesType) => Promise<Product>;
  updateImage: (params: ParamsImageDto, file: FileType) => Promise<Product>;
}
