import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class DeleteProductFromCategoryDto {

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ type: Array<String>, required: true })
        productIds: string[];

}
