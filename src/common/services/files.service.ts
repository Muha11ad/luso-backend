import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ExceptionErrorTypes } from '@/types';
import { ensureDir, writeFile, unlink } from 'fs-extra';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { convertImageToWebP, pathToUpload } from '@/common/utils';

export enum ImageFolderName {
  category = 'category',
  product = 'product',
}
@Injectable()
export class FilesService {
  private readonly baseUrl = 'http://localhost:3000/uploads';
  async saveFile(file: Express.Multer.File, folder: ImageFolderName): Promise<string> {
    try {
      const uploadFolder = path.resolve(pathToUpload, folder);

      await ensureDir(uploadFolder);
      const fileExtension = '.webp';
      const uniqueFileName = `${uuidv4()}${fileExtension}`;

      const webpBuffer = await convertImageToWebP(file);
      const filePath = path.join(uploadFolder, uniqueFileName);
      await writeFile(filePath, webpBuffer);

      const relativePath = `${folder}/${uniqueFileName}`;
      return `${this.baseUrl}/${relativePath}`;
    } catch (error) {
      throw new BadGatewayException(ExceptionErrorTypes.ERROR_SAVING_FILE);
    }
  }
  async deleteFile(fileName: string, folder: ImageFolderName): Promise<void> {
    try {
      fileName = fileName.split('/').pop();
      const filePath = path.resolve(pathToUpload, folder, fileName);
      await unlink(filePath);
    } catch (error) {
      throw new BadGatewayException(ExceptionErrorTypes.ERROR_DELETING_FILE);
    }
  }

  async updateFile(
    file: Express.Multer.File,
    folder: ImageFolderName,
    oldFileName: string,
  ): Promise<string> {
    try {
      await this.deleteFile(oldFileName, folder);
      return await this.saveFile(file, folder);
    } catch (error) {
      throw new BadGatewayException(ExceptionErrorTypes.ERROR_UPDATING_FILE);
    }
  }

  async saveMultipleFiles(
    files: Express.Multer.File[],
    folder: ImageFolderName,
  ): Promise<string[]> {
    try {
      const promises = files.map((file) => this.saveFile(file, folder));
      return await Promise.all(promises);
    } catch (error) {
      throw new BadGatewayException(ExceptionErrorTypes.ERROR_SAVING_FILE);
    }
  }
}
