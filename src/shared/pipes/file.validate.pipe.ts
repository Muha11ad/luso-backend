import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";

@Injectable()
export class FileValidatePipe implements PipeTransform {

    transform(files: Express.Multer.File[]): Express.Multer.File[] {
        if (!files || files.length === 0) {
            throw new BadRequestException("No files uploaded.");
        }

        const allowedMimeTypes = ["image/jpeg", "image/png"];
        const maxSize = 10 * 1024 * 1024; // 10MB

        for (const file of files) {

            if (!allowedMimeTypes.includes(file.mimetype)) {

                throw new BadRequestException(`Invalid file type: ${file.mimetype}`);

            }

            if (file.size > maxSize) {

                throw new BadRequestException(`File size exceeds 10MB.`);

            }

        }

        return files;
    }
}
