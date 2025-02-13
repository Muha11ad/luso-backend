import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FilterProductsDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        age: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        skinType: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, required: true })
        purpose: string;

}
