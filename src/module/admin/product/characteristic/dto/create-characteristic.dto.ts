import { Type } from "class-transformer";
import { TranslationsDto } from "@/shared/dto";
import { IsNumber, IsObject, IsString, IsOptional, IsPositive, IsNotEmpty } from "class-validator";

export class CharacteristicCreateDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
        age: number;

    @IsNotEmpty()
    @IsString()
        brand: string;

    @IsOptional()
    @IsObject()
    @Type(() => TranslationsDto)
        caution: TranslationsDto;

    @IsNotEmpty()
    @IsString()
        expirationDate: string;

    @IsNotEmpty()
    @IsString()
        volume: string;

    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        madeIn: TranslationsDto;

    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        purpose: TranslationsDto;

    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        gender: TranslationsDto;

    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        skinType: TranslationsDto;

    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        ingredients: TranslationsDto;

    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        applicationTime: TranslationsDto;

    @IsNotEmpty()
    @IsString()
        productId: string;

}
