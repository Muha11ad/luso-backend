import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { FolderName } from "@/shared/utils/enums";

export class UploadParamsDto {

    @ApiProperty({ enum:FolderName, required: true })
    @IsEnum(FolderName)
        folder: FolderName;
}