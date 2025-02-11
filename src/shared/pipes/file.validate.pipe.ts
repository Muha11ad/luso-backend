import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";

@Injectable()
export class FileValidatePipe implements PipeTransform {

    transform(file: Express.Multer.File): Express.Multer.File {

        if (!file) {

            throw new BadRequestException();

        }
        const allowedMimeTypes = ["image/jpeg", "image/png"];
        if (!allowedMimeTypes.includes(file.mimetype)) {

            throw new BadRequestException(
            );

        }

        const tenMb = 10000 * 1024;
        if (file.size > tenMb) {

            throw new BadRequestException();

        }

        return file;

    }

}
