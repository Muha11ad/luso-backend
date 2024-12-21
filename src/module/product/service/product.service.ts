import { IdDto } from '@/common/dto';
import { Prisma, Product } from '@prisma/client';
import { ExceptionErrorTypes, FilesType } from '@/types';
import { ProductCreateDto, ProductUpdateDto } from '../dto';
import { IProductService } from './product.service.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService, FilesService, ImageFolderName } from '@/common/services';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private readonly database: DatabaseService,
    private readonly filesService: FilesService,
  ) {}

  private async checkExistsAndThrowException(
    data: ProductCreateDto | ProductUpdateDto,
  ): Promise<void> {
    if (data['name'] !== undefined) {
      const nameExists = await this.database.product.findFirst({ where: { name: data.name } });
      if (nameExists) {
        throw new BadRequestException(ExceptionErrorTypes.ALREADY_EXISTS);
      }
    }
    if (data['categoryId'] !== undefined) {
      const categoryExists = await this.database.category.findFirst({
        where: { id: data.category_id },
      });
      if (categoryExists === null) {
        throw new BadRequestException(ExceptionErrorTypes.CATEGORY_DOES_EXISTS);
      }
    }
  }

  async create(data: ProductCreateDto, files: FilesType): Promise<Product> {
    await this.checkExistsAndThrowException(data);
    try {
      const savedFiles: string[] = await this.filesService.saveMultipleFiles(
        files,
        ImageFolderName.product,
      );
      const productData = {
        ...data,
        imageUrl_1: savedFiles[0],
        ...(savedFiles[1] && { imageUrl_2: savedFiles[1] }),
        ...(savedFiles[2] && { imageUrl_3: savedFiles[2] }),
      };
      return this.database.product.create({
        data: {
          ...productData,
          category_id: data.category_id,
        } as Prisma.ProductUncheckedCreateInput,
      });
    } catch (error) {
      throw new BadRequestException(`Error while creating product: ${error.message}`);
    }
  }
  async update({ id }: IdDto, data: ProductUpdateDto, files?: FilesType): Promise<Product> {
    await this.checkExistsAndThrowException(data);
    const product = await this.database.product.findFirst({ where: { id } });
    if (!product) {
      throw new BadRequestException(ExceptionErrorTypes.NOT_FOUND);
    }
    try {
      if (files && files.length > 0) {
        const savedFiles: string[] = await this.filesService.saveMultipleFiles(
          files,
          ImageFolderName.product,
        );
        const productData = {
          ...data,
          ...(savedFiles[0] && { imageUrl_1: savedFiles[0] }),
          ...(savedFiles[1] && { imageUrl_2: savedFiles[1] }),
          ...(savedFiles[2] && { imageUrl_3: savedFiles[2] }),
        };
        return this.database.product.update({
          where: { id },
          data: productData,
        });
      }
    } catch (error) {
      throw new BadRequestException(`Error while updating product: ${error.message}`);
    }
  }
  async findAll(): Promise<Product[]> {
    return this.database.product.findMany({
      include: { Characteristic: true },
    });
  }
  async delete({ id }: IdDto): Promise<Product> {
    const product = await this.database.product.findFirst({ where: { id } });
    if (!product) {
      throw new BadRequestException(ExceptionErrorTypes.NOT_FOUND);
    }
    return this.database.product.delete({ where: { id } });
  }
  async findById({ id }: IdDto): Promise<Product> {
    const product = await this.database.product.findFirst({
      where: { id },
      include: { Characteristic: true },
    });
    if (!product) {
      throw new BadRequestException(ExceptionErrorTypes.NOT_FOUND);
    }
    return product;
  }
  async findByName(name: string): Promise<Product[]> {
    return this.database.product.findMany({
      where: { name: { contains: name } },
      include: { Characteristic: true },
    });
  }
  async findByCategoryId({ id }: IdDto): Promise<Product[]> {
    return this.database.product.findMany({
      where: { category_id: id },
      include: { Characteristic: true },
    });
  }
}
