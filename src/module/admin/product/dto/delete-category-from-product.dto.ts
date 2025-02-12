import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteCategoryFromProductDto {

    @ApiProperty({ type: String, required: true })
    @IsString()
    @IsNotEmpty()
        categoryId: string;

}
