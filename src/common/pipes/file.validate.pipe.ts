import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { MaxFileSizeValidator, FileTypeValidator, ParseFilePipe } from '@nestjs/common';

@Injectable()
export class FileValidatePipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        new MaxFileSizeValidator({ maxSize: 8000 * 1024 }),
        new FileTypeValidator({ fileType: /jpeg|jpg|png/ }),
      ],
    });
  }
}
