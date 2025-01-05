import { FileType } from '@/types';
import { Category } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CategoryErrorTypes } from '../types';
import { ImageFolderName } from '@/common/services';
import { CategoryBaseService } from './category.base.service';

@Injectable()
export class CategoryImageService extends CategoryBaseService {
  async saveImage(id: string, file: FileType): Promise<Category> {
    await this.checkIdExistsAndThrowException(id);
    const imageUrl = await this.fileService.saveFile(file, ImageFolderName.category);
    return this.handleDatabaseOperation(
      () =>
        this.databaseService.category.update({
          where: { id },
          data: { imageUrl },
        }),
      CategoryErrorTypes.ERROR_SAVING_IMAGE,
    );
  }

  async updateImage(id: string, file: FileType): Promise<Category> {
    const category = await this.checkIdExistsAndThrowException(id);
    await this.fileService.deleteFile(category.imageUrl, ImageFolderName.category);
    const imageUrl = await this.fileService.saveFile(file, ImageFolderName.category);
    return this.handleDatabaseOperation(
      () =>
        this.databaseService.category.update({
          where: { id },
          data: { imageUrl },
        }),
      CategoryErrorTypes.ERROR_UPDATING_IMAGE,
    );
  }
}
