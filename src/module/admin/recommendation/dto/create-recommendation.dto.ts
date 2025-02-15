import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateRecommendationDto {

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @ApiProperty({ type: Number, required: true })
        userId: number
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        purpose: string

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ type: Array<String>, required: true })
        products: string[]
    
}