import { ExceptionErrorTypes } from '@/types';
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidatePipe implements PipeTransform {
  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException(ExceptionErrorTypes.FILE_REQUIRED);
    }
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(ExceptionErrorTypes.UNSUPPORTED_FILE_FORMAT);
    }

    const tenMb = 10000 * 1024;
    if (file.size > tenMb) {
      throw new BadRequestException(ExceptionErrorTypes.MAX_FILE_SIZE);
    }

    return file;
  }
}
