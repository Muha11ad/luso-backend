import { IdDto } from '@/common/dto';
import { Prisma, Product } from '@prisma/client';
import { ProductExceptionErrorTypes } from '../types';
import { CategoryErrorTypes } from '@/module/category/types';
import { IProductService } from './product.service.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createTranslation, updateTranslation } from '@/common/utils';
import { ExceptionErrorTypes, FileType, TranslationType } from '@/types';
import { ParamsImageDto, ProductCreateDto, ProductUpdateDto } from '../dto';
import { DatabaseService, FilesService, ImageFolderName } from '@/common/services';
import { AddCategoryToProductDto } from '../dto/add-category-to-product.dto';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private readonly database: DatabaseService,
    private readonly filesService: FilesService,
  ) {}

  private async checkNameExists(name: string): Promise<void> {
    const nameExists = await this.database.product.findUnique({ where: { name } });
    if (nameExists) {
      throw new BadRequestException(ExceptionErrorTypes.ALREADY_EXISTS);
    }
  }

  private async getProductById(id: string): Promise<Product> {
    const product = await this.database.product.findFirst({ where: { id } });
    if (!product) {
      throw new BadRequestException(CategoryErrorTypes.NOT_FOUND);
    }
    return product;
  }

  private async checkCategoryExists(category_id: string): Promise<void> {
    const categoryExists = await this.database.category.findFirst({ where: { id: category_id } });
    if (!categoryExists) {
      throw new BadRequestException(CategoryErrorTypes.NOT_FOUND);
    }
  }

  async create(data: ProductCreateDto): Promise<Product> {
    await this.checkNameExists(data.name);
    const productData = {
      name: data.name,
      price: data.price,
      available: data.available,
      instruction: createTranslation(data.instruction),
    };
    return this.handleDatabaseOperation(
      () => this.database.product.create({ data: productData }),
      ProductExceptionErrorTypes.ERROR_CREATING,
    );
  }

  async update({ id }: IdDto, data: ProductUpdateDto): Promise<Product> {
    if (data.name) {
      await this.checkNameExists(data.name);
    }
    const existingProduct = await this.getProductById(id);
    const newData = this.buildUpdateData(existingProduct, data);
    return this.handleDatabaseOperation(
      () =>
        this.database.product.update({ where: { id }, data: newData as Prisma.ProductUpdateInput }),
      ProductExceptionErrorTypes.ERROR_UPDATING,
    );
  }

  async findAll(): Promise<Product[]> {
    return this.database.product.findMany({ include: { Characteristic: true, Images: true } });
  }

  async delete({ id }: IdDto): Promise<Product> {
    await this.getProductById(id);
    return this.handleDatabaseOperation(
      () => this.database.product.delete({ where: { id } }),
      ProductExceptionErrorTypes.ERROR_DELETING,
    );
  }

  async findById({ id }: IdDto): Promise<Product> {
    const product = await this.database.product.findFirst({
      where: { id },
      include: { Characteristic: true, Images: true },
    });
    if (!product) {
      throw new BadRequestException(ExceptionErrorTypes.NOT_FOUND);
    }
    return product;
  }

  async findByName(name: string): Promise<Product[]> {
    return this.handleDatabaseOperation(
      () =>
        this.database.product.findMany({
          where: { name: { contains: name, mode: 'insensitive' } },
          include: { Characteristic: true, Images: true },
        }),
      ProductExceptionErrorTypes.ERROR_FINDING_BY_NAME,
    );
  }

  async findByCategoryName(name: string): Promise<Product[]> {
    const category = await this.database.category.findFirst({
      where: { name: { path: ['en'], equals: name } },
      select: { id: true },
    });
    if (!category) {
      throw new BadRequestException(CategoryErrorTypes.NOT_FOUND);
    }
    return this.handleDatabaseOperation(
      () =>
        this.database.product.findMany({
          where: { categories: { some: { category_id: category.id } } },
          include: { Characteristic: true, Images: true },
        }),
      ProductExceptionErrorTypes.ERROR_FINDING_BY_CATEGORY,
    );
  }

  async addCategoryToProduct(product_id: string, data: AddCategoryToProductDto): Promise<Product> {
    await Promise.all(data.categoryIds.map(this.checkCategoryExists.bind(this)));
    const product = await this.getProductById(product_id);
    await this.handleDatabaseOperation(
      () =>
        this.database.productCategory.createMany({
          data: data.categoryIds.map((c_id: string) => ({ category_id: c_id, product_id })),
        }),
      ProductExceptionErrorTypes.ERROR_ADDING_CATEGORY,
    );
    return product;
  }

  async saveImages({ id }: IdDto, files: FileType[]): Promise<Product> {
    const product = await this.getProductById(id);
    const images = await this.filesService.saveMultipleFiles(files, ImageFolderName.product);
    return this.handleDatabaseOperation(
      () =>
        this.database.product.update({
          where: { id: product.id },
          data: { Images: { createMany: { data: images.map((image) => ({ imageUrl: image })) } } },
        }),
      ProductExceptionErrorTypes.ERROR_SAVING_IMAGES,
      async () => {
        await this.filesService.deleteMultipleFiles(images, ImageFolderName.product);
      },
    );
  }

  async updateImage({ id, image_id }: ParamsImageDto, file: FileType): Promise<Product> {
    const existingProduct = await this.getProductById(id);
    const image = await this.database.productImages.findFirst({ where: { id: image_id } });
    if (!image) {
      throw new BadRequestException(ProductExceptionErrorTypes.IMAGE_NOT_FOUND);
    }
    const newImageLink = await this.filesService.updateFile(
      file,
      ImageFolderName.product,
      image.imageUrl,
    );
    return this.handleDatabaseOperation(
      () =>
        this.database.product.update({
          where: { id: existingProduct.id },
          data: {
            Images: { update: { where: { id: image_id }, data: { imageUrl: newImageLink } } },
          },
        }),
      ProductExceptionErrorTypes.ERROR_UPDATING_IMAGE,
    );
  }

  async deleteImage({ id, image_id }: ParamsImageDto): Promise<Product> {
    const existingProduct = await this.getProductById(id);
    const image = await this.database.productImages.findFirst({ where: { id: image_id } });
    if (!image) {
      throw new BadRequestException(ProductExceptionErrorTypes.IMAGE_NOT_FOUND);
    }
    await this.filesService.deleteFile(image.imageUrl, ImageFolderName.product);
    return this.handleDatabaseOperation(
      () =>
        this.database.product.update({
          where: { id: existingProduct.id },
          data: { Images: { delete: { id: image_id } } },
        }),
      ProductExceptionErrorTypes.ERROR_DELETING_IMAGE,
    );
  }

  private buildUpdateData(
    existingProduct: Product,
    data: ProductUpdateDto,
  ): Prisma.ProductUpdateInput {
    return {
      ...(data.name && { name: data.name }),
      ...(data.price && { price: data.price }),
      ...(data.available && { available: data.available }),
      ...(data.instruction && {
        instruction: updateTranslation(
          existingProduct.instruction as TranslationType,
          data.instruction,
        ),
      }),
    };
  }

  private async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
    errorType: string,
    rollback?: () => Promise<void>,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (rollback) {
        await rollback();
      }
      throw new BadRequestException(`${errorType}: ${error.message}`);
    }
  }
}
