import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRecommendationDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        userId: string
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        age: string
        
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        skinType: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        purpose: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        userLang: string
    
}