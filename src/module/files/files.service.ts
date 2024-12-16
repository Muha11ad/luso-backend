import path from 'app-root-path';
import { format } from 'date-fns';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ensureDir, writeFile } from 'fs-extra';
import { ErrorTypes } from '@/types';

@Injectable()
export class FilesService {
  async saveFile(file: Express.Multer.File) {
    try {
      const dateFolder = format(new Date(), 'yyyy-MM-dd');
      const uploadFolder = `${path}/uploads/${dateFolder}`;
      await ensureDir(uploadFolder);
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      return `${dateFolder}/${file.originalname}`;
    } catch (error) {
      throw new BadGatewayException(ErrorTypes.ERROR_SAVING_FILE);
    }
  }
}
