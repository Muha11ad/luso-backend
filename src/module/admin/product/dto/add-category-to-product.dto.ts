import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsNotEmpty, ValidateNested } from "class-validator";

export class AddCategoryToProductDto {

    @IsArray()
    @IsNotEmpty()
    @ArrayNotEmpty()
    @ApiProperty({ type: Array, required: true })
        categoryIds: string[];

}
