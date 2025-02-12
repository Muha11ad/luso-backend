import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class DeleteMultipleFilesDto {

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
       fileNames: string[];

}