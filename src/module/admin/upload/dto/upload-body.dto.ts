import { ApiProperty } from "@nestjs/swagger";
import { FilesType } from "@/shared/utils/types";

export class UploadImagesBodyDto {

    @ApiProperty({ type: "file", isArray: true, })
    images: FilesType;

}