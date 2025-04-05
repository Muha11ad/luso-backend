import { UploadService } from "./upload.service";
import { FilesType } from "@/shared/utils/types";
import { ENDPOINTS } from "@/shared/utils/consts";
import { FileValidatePipe } from "@/shared/pipes";
import { setResult } from "@/shared/utils/helpers";
import { UploadParamsDto } from "./dto/upload-params.dto";
import { UploadImagesBodyDto } from "./dto/upload-body.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { DeleteMultipleFilesDto } from "./dto/delete-multiple-files.dto";
import { UploadDeleteMultipleFilesReq, UploadMultipliFilesReq } from "./upload.interface";
import { Body, Controller, Delete, Param, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.upload)
export class UploadController {

    constructor(private readonly uploadService: UploadService) { }

    @Post("image/:folder")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FilesInterceptor('images'))
    async uploadImages(
        @Param() param: UploadParamsDto,
        @Body() body: UploadImagesBodyDto,
        @UploadedFiles(new FileValidatePipe) images: FilesType,
    ) {

        const requestData: UploadMultipliFilesReq = {
            files: images,
            folder: param.folder,
        }

        const { errId, data } = await this.uploadService.saveMultipleFiles(requestData);

        return setResult({ uploads: data }, errId);

    }

    @Delete("image/:folder")
    async deleteImages(@Param() param: UploadParamsDto, @Body() body: DeleteMultipleFilesDto) {

        const requestData: UploadDeleteMultipleFilesReq = {
            folder: param.folder,
            fileNames: body.fileNames
        }

        const { errId, data } = await this.uploadService.deleteMultipleFiles(requestData);

        return setResult({ uploads: data }, errId);

    }

}
