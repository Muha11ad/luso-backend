import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { TranslationsDto } from "@/shared/dto";
import { IsNumber, IsObject, IsString, IsOptional, IsPositive, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";

export class CharacteristicCreateDto {

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    @ApiProperty({ type: Number, required: true })
        age: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true }) 
        brand: string;

    @IsObject()
    @IsOptional()
    @Type(() => TranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: TranslationsDto, required: false })
        caution: TranslationsDto;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true }) 
        expirationDate: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true }) 
        volume: string;

    @IsObject()
    @IsNotEmpty()
    @Type(() => TranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: TranslationsDto, required: true })
        madeIn: TranslationsDto;

    @IsObject()
    @IsNotEmpty()
    @Type(() => TranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: TranslationsDto, required: true })
        purpose: TranslationsDto;

    @IsObject()
    @IsNotEmpty()
    @Type(() => TranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({type: TranslationsDto, required: true })
        gender: TranslationsDto;

    @IsObject()
    @IsNotEmpty()
    @Type(() => TranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: TranslationsDto, required: true })
        skinType: TranslationsDto;

    @IsObject()
    @IsNotEmpty()
    @Type(() => TranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: TranslationsDto, required: true })
        ingredients: TranslationsDto;

    @IsObject()
    @IsNotEmpty()
    @Type(() => TranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: TranslationsDto, required: true })
        applicationTime: TranslationsDto;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        productId: string;

}
