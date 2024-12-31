import { Product } from '@prisma/client';
import { IdDto, NameDto } from '@/common/dto';
import { FilesType, FileType } from '@/types';
import { ParamsImageDto, ProductCreateDto, ProductUpdateDto } from '../dto';

export interface IProductController {
  getAllProducts: () => Promise<Product[]>;
  deleteProduct: (id: IdDto) => Promise<Product>;
  getProductById: (id: IdDto) => Promise<Product>;
  getProductByName: (param: NameDto) => Promise<Product>;
  createProduct: (data: ProductCreateDto) => Promise<Product>;
  getProductByCategoryId: (param: IdDto) => Promise<Product[]>;
  updateProduct: (id: IdDto, data: ProductUpdateDto) => Promise<Product>;

  deleteImage: (params: ParamsImageDto) => Promise<Product>;
  saveImages: (id: IdDto, files: FilesType) => Promise<Product>;
  updateImage: (params: ParamsImageDto, file: FileType) => Promise<Product>;
}
