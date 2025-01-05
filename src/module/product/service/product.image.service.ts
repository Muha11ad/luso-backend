import { FileType } from '@/types';
import { IdDto } from '@/common/dto';
import { ParamsImageDto } from '../dto';
import { Product } from '@prisma/client';
import { ImageFolderName } from '@/common/services';
import { BadRequestException } from '@nestjs/common';
import { ProductExceptionErrorTypes } from '../types';
import { ProductBaseService } from './product.base.service';

export class ProductImageService extends ProductBaseService {
  public async saveImages({ id }: IdDto, files: FileType[]): Promise<Product> {
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

  public async updateImage({ id, image_id }: ParamsImageDto, file: FileType): Promise<Product> {
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

  public async deleteImage({ id, image_id }: ParamsImageDto): Promise<Product> {
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
}
