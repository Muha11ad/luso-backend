import { IdDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { FilesType, FileType } from '@/types';
import { ParamsImageDto, ProductCreateDto, ProductUpdateDto } from '../dto';

export interface IProductService {
  findAll: () => Promise<Product[]>;
  delete: (id: IdDto) => Promise<Product>;
  findById: (id: IdDto) => Promise<Product>;
  findByName: (name: string) => Promise<Product[]>;
  create: (data: ProductCreateDto) => Promise<Product>;
  findByCategoryName: (name: string) => Promise<Product[]>;
  update: (id: IdDto, data: ProductUpdateDto) => Promise<Product>;

  deleteImage: (params: ParamsImageDto) => Promise<Product>;
  saveImages: (id: IdDto, files: FilesType) => Promise<Product>;
  updateImage: (params: ParamsImageDto, file: FileType) => Promise<Product>;
}
