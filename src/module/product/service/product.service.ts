import { IdDto } from '@/common/dto';
import { Prisma, Product } from '@prisma/client';
import { ExceptionErrorTypes, FilesType } from '@/types';
import { ProductCreateDto, ProductNameTranslations, ProductUpdateDto } from '../dto';
import { IProductService } from './product.service.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService, FilesService, ImageFolderName } from '@/common/services';
import { ProductExceptionErrorTypes } from '../types';
import { CategoryErrorTypes } from '@/module/category/types';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private readonly database: DatabaseService,
    private readonly filesService: FilesService,
  ) {}

  private async checkNameAndExistsAndThrowException(name: ProductNameTranslations): Promise<void> {
    const nameExists = await this.database.product.findFirst({
      where: { name: name as Prisma.JsonFilter<'Product'> },
    });
    if (nameExists) {
      throw new BadRequestException(ExceptionErrorTypes.ALREADY_EXISTS);
    }
  }
  private async checkIdExistsAndThrowException(id: string): Promise<Product> {
    const productExists = await this.database.product.findFirst({
      where: { id },
    });
    if (productExists === null) {
      throw new BadRequestException(CategoryErrorTypes.NOT_FOUND);
    }
    return productExists;
  }
  private async checkCategoryIdExistsAndThrowException(category_id: string): Promise<void> {
    const categoryExists = await this.database.category.findFirst({
      where: { id: category_id },
    });
    if (categoryExists === null) {
      throw new BadRequestException(CategoryErrorTypes.NOT_FOUND);
    }
  }
  private getImageUrls = (product: Product): string[] => {
    const images: string[] = [];
    if (product.imageUrl_1) {
      images.push(product.imageUrl_1);
    }
    if (product.imageUrl_2) {
      images.push(product.imageUrl_2);
    }
    if (product.imageUrl_3) {
      images.push(product.imageUrl_3);
    }
    return images;
  };

  async create(data: ProductCreateDto): Promise<Product> {
    await this.checkCategoryIdExistsAndThrowException(data.category_id);
    await this.checkNameAndExistsAndThrowException(data.name);
    try {
      const productData = {
        ...data,
        name: {
          uz: data.name.uz,
          ru: data.name.ru,
          en: data.name.en,
        },
        instruction: {
          uz: data.instruction.uz,
          ru: data.instruction.ru,
          en: data.instruction.en,
        },
      };
      return this.database.product.create({
        data: productData,
      });
    } catch (error) {
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_CREATING}: ${error.message}`,
      );
    }
  }

  async update({ id }: IdDto, data: ProductUpdateDto): Promise<Product> {
    if (data['category_id']) {
      await this.checkCategoryIdExistsAndThrowException(data.category_id);
    }
    if (data['name']) {
      await this.checkNameAndExistsAndThrowException(data.name as ProductNameTranslations);
    }

    await this.checkIdExistsAndThrowException(id);
    try {
      return this.database.product.update({
        where: { id },
        data: data as Prisma.ProductUpdateInput,
      });
    } catch (error) {
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_UPDATING}: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Product[]> {
    return this.database.product.findMany({
      include: { Characteristic: true },
    });
  }

  async delete({ id }: IdDto): Promise<Product> {
    const product = await this.checkIdExistsAndThrowException(id);
    const images = this.getImageUrls(product);
    await this.filesService.deleteMultipleFiles(images, ImageFolderName.product);
    try {
      return this.database.product.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_DELETING}: ${error.message}`,
      );
    }
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

  async findByName(name: ProductNameTranslations): Promise<Product[]> {
    try {
      return this.database.product.findMany({
        where: { name: name as Prisma.JsonFilter<'Product'> },
        include: { Characteristic: true },
      });
    } catch (error) {
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_FINDING_BY_NAME}: ${error.message}`,
      );
    }
  }

  async findByCategoryId({ id }: IdDto): Promise<Product[]> {
    try {
      return this.database.product.findMany({
        where: { category_id: id },
        include: { Characteristic: true },
      });
    } catch (error) {
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_FINDING_BY_CATEGORY}: ${error.message}`,
      );
    }
  }

  async saveImages({ id }: IdDto, files: FilesType): Promise<Product> {
    await this.checkIdExistsAndThrowException(id);
    try {
      const linkToImages: string[] = await this.filesService.saveMultipleFiles(
        files,
        ImageFolderName.product,
      );
      const images = {
        imageUrl_1: linkToImages[0],
        ...(linkToImages[1] && { imageUrl_2: linkToImages[1] }),
        ...(linkToImages[2] && { imageUrl_3: linkToImages[2] }),
      };
      return this.database.product.update({
        where: { id },
        data: images,
      });
    } catch (error) {
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_SAVING_IMAGES}: ${error.message}`,
      );
    }
  }
// fix
  async updateImages({ id }: IdDto, files: FilesType): Promise<Product> {
    const product = await this.checkIdExistsAndThrowException(id);
    const oldImageUrls : string[]  = this.getImageUrls(product);
    const newImageUrls: string[] = await this.filesService.saveMultipleFiles(
      files,
      ImageFolderName.product,
    );
    const newImageUrl
    if()
    try {
      const images = {
        imageUrl_1: linkToImages[0],
        ...(linkToImages[1] && { imageUrl_2: linkToImages[1] }),
        ...(linkToImages[2] && { imageUrl_3: linkToImages[2] }),
      };
      return this.database.product.update({
        where: { id },
        data: images,
      });
    } catch (error) {
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_SAVING_IMAGES}: ${error.message}`,
      );
    }
  }
}
