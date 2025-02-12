import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class DeleteProductFromCategoryDto {

    @ApiProperty({ type: Array<String>, required: true })
    @IsNotEmpty()
    @IsArray()
        productIds: string[];

}
