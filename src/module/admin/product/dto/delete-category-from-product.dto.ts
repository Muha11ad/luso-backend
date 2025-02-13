import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteCategoryFromProductDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        categoryId: string;

}
