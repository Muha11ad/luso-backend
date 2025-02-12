import { Response } from "express";
import { UploadService } from "./upload.service";
import { FilesType } from "@/shared/utils/types";
import { ENDPOINTS } from "@/shared/utils/consts";
import { FileValidatePipe } from "@/shared/pipes";
import { setResult } from "@/shared/utils/helpers";
import { UploadParamsDto } from "./dto/upload-params.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { DeleteMultipleFilesDto } from "./dto/delete-multiple-files.dto";
import { UploadDeleteMultipleFilesReq, UploadMultipliFilesReq } from "./upload.interface";
import { Body, Controller, Delete, HttpStatus, Param, ParseFilePipe, Post, Res, UploadedFiles, UseInterceptors, UsePipes } from "@nestjs/common";

@Controller(ENDPOINTS.upload)
@ApiTags(ENDPOINTS.upload)
@ApiBearerAuth()
export class UploadController {

    constructor(private readonly uploadService: UploadService) { }

    @Post("image/:folder")
    @UsePipes(FileValidatePipe)
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FilesInterceptor('image'))
    async uploadImages(
        @Res() res: Response,
        @Param() param: UploadParamsDto,
        @UploadedFiles(ParseFilePipe, new FileValidatePipe()) files: FilesType
    ) {

        const requestData: UploadMultipliFilesReq = {
            files,
            folder: param.folder,
        }

        const { errId, data } = await this.uploadService.saveMultipleFiles(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        }

        return res.status(HttpStatus.CREATED).jsonp(setResult(data, null));

    }

    @Delete("image/:folder")
    async deleteImages(@Res() res: Response, @Param() param: UploadParamsDto, @Body() body: DeleteMultipleFilesDto) {

        const requestData: UploadDeleteMultipleFilesReq = {
            folder: param.folder,
            fileNames: body.fileNames
        }

        const { errId, data } = await this.uploadService.deleteMultipleFiles(requestData);

        if (errId) {

            return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).jsonp(setResult(data, null));

    }

}
