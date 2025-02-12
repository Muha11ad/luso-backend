import { Type } from "class-transformer";
import { TranslationsDto } from "@/shared/dto";
import { IsNumber, IsObject, IsString, IsOptional, IsPositive, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CharacteristicCreateDto {

    @ApiProperty({ type: Number, required: true })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
        age: number;

    @ApiProperty({ type: String, required: true }) 
    @IsNotEmpty()
    @IsString()
        brand: string;

    @ApiProperty({ type: TranslationsDto, required: false })
    @IsOptional()
    @IsObject()
    @Type(() => TranslationsDto)
        caution: TranslationsDto;

    @ApiProperty({ type: String, required: true }) 
    @IsNotEmpty()
    @IsString()
        expirationDate: string;

    @ApiProperty({ type: String, required: true }) 
    @IsNotEmpty()
    @IsString()
        volume: string;

    @ApiProperty({ type: TranslationsDto, required: true })
    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        madeIn: TranslationsDto;

    @ApiProperty({ type: TranslationsDto, required: true })
    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        purpose: TranslationsDto;

    @ApiProperty({type: TranslationsDto, required: true })
    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        gender: TranslationsDto;

    @ApiProperty({ type: TranslationsDto, required: true })
    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        skinType: TranslationsDto;

    @ApiProperty({ type: TranslationsDto, required: true })
    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        ingredients: TranslationsDto;

    @ApiProperty({ type: TranslationsDto, required: true })
    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        applicationTime: TranslationsDto;

    @ApiProperty({ type: TranslationsDto, required: true })
    @IsNotEmpty()
    @IsString()
        productId: string;

}
