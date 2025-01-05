import { Product } from '@prisma/client';
import { IdDto, NameDto } from '@/common/dto';
import { FilesType, FileType } from '@/types';
import { ParamsImageDto, ProductCreateDto, ProductUpdateDto } from '../dto';
import { AddCategoryToProductDto } from '../dto/add-category-to-product.dto';

export interface IProductController {
  getAllProducts: () => Promise<Product[]>;
  getProductById: (id: IdDto) => Promise<Product>;
  getProductByCategoryName: (param: NameDto) => Promise<Product[]>;
  getProductByName: (param: NameDto) => Promise<Product[]>;

  addCategoryToProduct: (param: IdDto, data: AddCategoryToProductDto) => Promise<Product>;

  deleteProduct: (id: IdDto) => Promise<Product>;
  createProduct: (data: ProductCreateDto) => Promise<Product>;
  updateProduct: (id: IdDto, data: ProductUpdateDto) => Promise<Product>;

  deleteImage: (params: ParamsImageDto) => Promise<Product>;
  saveImages: (id: IdDto, files: FilesType) => Promise<Product>;
  updateImage: (params: ParamsImageDto, file: FileType) => Promise<Product>;
}
