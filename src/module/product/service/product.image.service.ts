import { FileType } from '@/types';
import { IdDto } from '@/common/dto';
import { ParamsImageDto } from '../dto';
import { Product } from '@prisma/client';
import { ImageFolderName } from '@/common/providers';
import { BadRequestException } from '@nestjs/common';
import { PRODUCT_MESSAGES } from '../product.consts';
import { ProductBaseService } from './product.base.service';

export class ProductImageService extends ProductBaseService {
  public async saveImages({ id }: IdDto, files: FileType[]): Promise<Product> {
    const product = await this.getProductById(id);
    const images = await this.filesProvider.saveMultipleFiles(files, ImageFolderName.product);
    return this.handleDatabaseOperation(
      () =>
        this.database.product.update({
          where: { id: product.id },
          data: { Images: { createMany: { data: images.map((image) => ({ imageUrl: image })) } } },
        }),
      PRODUCT_MESSAGES.error_image_save,
    );
  }

  public async updateImage({ id, image_id }: ParamsImageDto, file: FileType): Promise<Product> {
    const existingProduct = await this.getProductById(id);
    const image = await this.database.productImages.findFirst({ where: { id: image_id } });
    if (!image) {
      throw new BadRequestException(PRODUCT_MESSAGES.error_image_not_found);
    }
    const newImageLink = await this.filesProvider.updateFile(
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
      PRODUCT_MESSAGES.error_image_update,
    );
  }

  public async deleteImage({ id, image_id }: ParamsImageDto): Promise<Product> {
    const existingProduct = await this.getProductById(id);
    const image = await this.database.productImages.findFirst({ where: { id: image_id } });
    if (!image) {
      throw new BadRequestException(PRODUCT_MESSAGES.error_image_not_found);
    }
    await this.filesProvider.deleteFile(image.imageUrl, ImageFolderName.product);
    return this.handleDatabaseOperation(
      () =>
        this.database.product.update({
          where: { id: existingProduct.id },
          data: { Images: { delete: { id: image_id } } },
        }),
      PRODUCT_MESSAGES.error_image_delete,
    );
  }
}
