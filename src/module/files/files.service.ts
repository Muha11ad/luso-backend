import * as path from 'path';
import { ErrorTypes } from '@/types';
import { ensureDir, writeFile } from 'fs-extra';
import { convertImageToWebP, pathToUpload } from '@/common/utils';
import { BadGatewayException, Injectable } from '@nestjs/common';

export enum ForderName {
  category = 'category',
  product = 'product',
}
@Injectable()
export class FilesService {
  async saveFile(file: Express.Multer.File, folder: ForderName): Promise<string> {
    try {
      const dateFolder = new Date().toISOString().split('T')[0];
      const uploadFolder = path.resolve(pathToUpload, folder);
      await ensureDir(uploadFolder);

      const webpBuffer = await convertImageToWebP(file);
      const webpFileName = `${file.originalname.split('.').slice(0, -1).join('.')}.webp`;

      await writeFile(`${uploadFolder}/${webpFileName}`, webpBuffer);

      return `${dateFolder}/${webpFileName}`;
    } catch (error) {
      throw new BadGatewayException(ErrorTypes.ERROR_SAVING_FILE);
    }
  }
}
