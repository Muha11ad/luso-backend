import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsArray, ArrayNotEmpty } from "class-validator";

export class AddProductToCategoryDto {

    @IsArray()
    @IsNotEmpty()
    @ArrayNotEmpty()
    @ApiProperty({ type: [String], required: true })
        productIds: string[];

}
