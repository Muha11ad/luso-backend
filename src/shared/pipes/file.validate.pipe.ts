import { FilesType } from "../utils/types";
import { ALLOWED_MIME_TYPES } from "../utils/consts";
import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";

@Injectable()
export class FileValidatePipe implements PipeTransform {

    transform(files: FilesType): FilesType {

        if (!files || files.length === 0) throw new BadRequestException("No files uploaded.");


        const maxSize = 10 * 1024 * 1024; // 10MB

        for (const file of files) {

            if (!ALLOWED_MIME_TYPES.has(file.mimetype)) throw new BadRequestException(`Invalid file type: ${file.mimetype}`);

            if (file.size > maxSize) throw new BadRequestException(`File size exceeds 10MB.`);

        }

        return files;
    }

}
