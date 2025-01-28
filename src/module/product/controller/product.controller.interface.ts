import {
  ParamsImageDto,
  ProductCreateDto,
  ProductUpdateDto,
  FilterProductsDto,
  AddCategoryToProductDto,
} from '../dto';
import { IdDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { FilesType, FileType } from '@/types';

export interface IProductController {
  getAllProducts: () => Promise<Product[]>;
  getProductById: (id: IdDto) => Promise<Product>;
  getProductsByFilter: (data: FilterProductsDto) => Promise<Product[]>;

  addCategoryToProduct: (param: IdDto, data: AddCategoryToProductDto) => Promise<string>;

  deleteProduct: (param: IdDto) => Promise<string>;
  createProduct: (data: ProductCreateDto) => Promise<string>;
  updateProduct: (param: IdDto, data: ProductUpdateDto) => Promise<string>;

  deleteImage: (params: ParamsImageDto) => Promise<string>;
  saveImages: (id: IdDto, files: FilesType) => Promise<string>;
  updateImage: (params: ParamsImageDto, file: FileType) => Promise<string>;
}
