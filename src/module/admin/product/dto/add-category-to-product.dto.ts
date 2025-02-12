import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsNotEmpty } from "class-validator";

export class AddCategoryToProductDto {

    @ApiProperty({ type: Array, required: true })
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
        categoryIds: string[];

}
