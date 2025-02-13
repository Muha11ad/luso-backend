import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ensureDir, writeFile, unlink } from "fs-extra";
import { convertImageToWebP } from "@/shared/utils/helpers";
import { BaseResponse, SuccessRes } from "@/shared/utils/types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { UploadDeleteFileReq, UploadDeleteMultipleFilesReq, UploadFileReq, UploadMultipliFilesReq } from "./upload.interface";

@Injectable()
export class UploadService {

    private readonly baseUrl: string;
    private readonly pathToUpload: string;


    constructor(private readonly config: ConfigService) {

        this.baseUrl = this.config.get<string>("file.origin"),
        this.pathToUpload =  this.config.get<string>("file.pathToUpload")

    }

    private async saveFile(reqData: UploadFileReq): Promise<BaseResponse<string>> {

        try {
            
            const uploadFolder = path.resolve(this.pathToUpload, reqData.folder);
            await ensureDir(uploadFolder);

            const fileExtension = ".webp";
            const uniqueFileName = `${uuidv4()}${fileExtension}`;
            const webpBuffer = await convertImageToWebP(reqData.file);

            const filePath = path.join(uploadFolder, uniqueFileName);
            await writeFile(filePath, webpBuffer);

            const relativePath = `${reqData.folder}/${uniqueFileName}`;
            return { data: `${this.baseUrl}/${relativePath}`, errId: null };

        } catch (error) {

            return ServiceExceptions.handle(error, UploadService.name, 'saveFile');

        }
    }

    private async deleteFile(reqData: UploadDeleteFileReq): Promise<BaseResponse<SuccessRes>> {

        try {

            const fileName = path.basename(reqData.fileName);
            const filePath = path.resolve(this.pathToUpload, reqData.folder, fileName);

            await unlink(filePath);

            return { data: { success: true }, errId: null };

        } catch (error) {

            return ServiceExceptions.handle(error, UploadService.name, 'deleteFile');

        }
    }

    public async saveMultipleFiles(reqData: UploadMultipliFilesReq): Promise<BaseResponse<string[]>> {

        try {

            const savedFiles: string[] = [];

            for (const file of reqData.files) {

                const result = await this.saveFile({ file, folder: reqData.folder });

                if (result.errId) {

                    return { data: null, errId: result.errId };

                }

                savedFiles.push(result.data);
            }

            return { data: savedFiles, errId: null };

        } catch (error) {

            return ServiceExceptions.handle(error, UploadService.name, 'saveMultipleFiles');

        }
    }

    public async deleteMultipleFiles(reqData: UploadDeleteMultipleFilesReq): Promise<BaseResponse<SuccessRes>> {

        try {

            for (const fileName of reqData.fileNames) {

                const result = await this.deleteFile({ fileName, folder: reqData.folder });

                if (result.errId) {

                    return { data: null, errId: result.errId };

                }
            }

            return { data: { success: true }, errId: null };

        } catch (error) {

            return ServiceExceptions.handle(error, UploadService.name, 'deleteMultipleFiles');

        }
    }
}
