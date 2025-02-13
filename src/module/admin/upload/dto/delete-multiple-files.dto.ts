import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class DeleteMultipleFilesDto {

    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    @ApiProperty({ type: [String] })
       fileNames: string[];

}