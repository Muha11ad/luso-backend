import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class DeleteImagesFromProductDto {

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ type: Array<String>, required: true })
        imageIds: string[];

}
