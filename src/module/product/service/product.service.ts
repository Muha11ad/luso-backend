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

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private readonly database: DatabaseService,
    private readonly filesService: FilesService,
  ) {}

  private async checkNameAndExistsAndThrowException(name: string): Promise<void> {
    const nameExists = await this.database.product.findUnique({
      where: { name },
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

  async create(data: ProductCreateDto): Promise<Product> {
    await this.checkCategoryIdExistsAndThrowException(data.category_id);
    await this.checkNameAndExistsAndThrowException(data.name);
    try {
      const productData = {
        ...data,
        instruction: createTranslation(data.instruction),
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
      await this.checkNameAndExistsAndThrowException(data.name);
    }
    const exsitingProdcut = await this.checkIdExistsAndThrowException(id);
    try {
      const newData = {
        ...data,
        ...(data['instruction'] && {
          instruction: updateTranslation(
            exsitingProdcut.instruction as TranslationType,
            data.instruction,
          ),
        }),
      };
      return this.database.product.update({
        where: { id },
        data: newData as Prisma.ProductUpdateInput,
      });
    } catch (error) {
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_UPDATING}: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Product[]> {
    return this.database.product.findMany({
      include: { Characteristic: true, Images: true },
    });
  }

  async delete({ id }: IdDto): Promise<Product> {
    await this.checkIdExistsAndThrowException(id);
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
      include: { Characteristic: true, Images: true },
    });
    if (!product) {
      throw new BadRequestException(ExceptionErrorTypes.NOT_FOUND);
    }
    return product;
  }

  async findByName(name: string): Promise<Product[]> {
    try {
      return this.database.product.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },

        include: { Characteristic: true, Images: true },
      });
    } catch (error) {
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_FINDING_BY_NAME}: ${error.message}`,
      );
    }
  }

  async findByCategoryName(name: string): Promise<Product[]> {
    const category = await this.database.category.findFirst({
      where: {
        name: {
          path: ['en'],
          equals: name,
        },
      },
    });

    if (!category) {
      throw new BadRequestException(CategoryErrorTypes.NOT_FOUND);
    }
    try {
      return this.database.product.findMany({
        where: { category_id: category.id },
        include: { Characteristic: true, Images: true },
      });
    } catch (error) {
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_FINDING_BY_CATEGORY}: ${error.message}`,
      );
    }
  }

  async saveImages({ id }: IdDto, files: FileType[]): Promise<Product> {
    const product = await this.checkIdExistsAndThrowException(id);
    const images: string[] = await this.filesService.saveMultipleFiles(
      files,
      ImageFolderName.product,
    );
    try {
      return this.database.product.update({
        where: { id: product.id },
        data: {
          Images: {
            createMany: { data: images.map((image) => ({ imageUrl: image })) },
          },
        },
      });
    } catch (error) {
      await this.filesService.deleteMultipleFiles(images, ImageFolderName.product);
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_SAVING_IMAGES}: ${error.message}`,
      );
    }
  }

  async updateImage({ id, image_id }: ParamsImageDto, file: FileType): Promise<Product> {
    const existingProduct = await this.checkIdExistsAndThrowException(id);
    const image = await this.database.productImages.findFirst({
      where: { id: image_id },
    });
    if (!image) {
      throw new BadRequestException(ProductExceptionErrorTypes.IMAGE_NOT_FOUND);
    }
    const newImageLink: string = await this.filesService.updateFile(
      file,
      ImageFolderName.product,
      image.imageUrl,
    );
    try {
      return this.database.product.update({
        where: { id: existingProduct.id },
        data: {
          Images: {
            update: {
              where: { id: image_id },
              data: { imageUrl: newImageLink },
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_UPDATING_IMAGE}: ${error.message}`,
      );
    }
  }

  async deleteImage({ id, image_id }: ParamsImageDto): Promise<Product> {
    const existingProduct = await this.checkIdExistsAndThrowException(id);
    const image = await this.database.productImages.findFirst({
      where: { id: image_id },
    });
    if (!image) {
      throw new BadRequestException(ProductExceptionErrorTypes.IMAGE_NOT_FOUND);
    }
    try {
      await this.filesService.deleteFile(image.imageUrl, ImageFolderName.product);
      return this.database.product.update({
        where: { id: existingProduct.id },
        data: {
          Images: {
            delete: { id: image_id },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `${ProductExceptionErrorTypes.ERROR_UPDATING_IMAGE}: ${error.message}`,
      );
    }
  }
}
