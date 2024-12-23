import { FilesType, FileType } from '@/types';
import { IdDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { ParamsImageDto, ProductCreateDto, ProductUpdateDto } from '../dto';

export interface IProductService {
  findAll: () => Promise<Product[]>;
  delete: (id: IdDto) => Promise<Product>;
  findById: (id: IdDto) => Promise<Product>;
  create: (data: ProductCreateDto) => Promise<Product>;
  findByCategoryId: (categoryId: IdDto) => Promise<Product[]>;
  update: (id: IdDto, data: ProductUpdateDto) => Promise<Product>;
  findByName: (name: string) => Promise<Product>;

  deleteImage: (params: ParamsImageDto) => Promise<Product>;
  saveImages: (id: IdDto, files: FilesType) => Promise<Product>;
  updateImage: (params: ParamsImageDto, file: FileType) => Promise<Product>;
}
