import { Type } from "class-transformer";
import { TranslationsDto } from "@/shared/dto";
import { IsNotEmpty, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CategoryCreateDto {

    @ApiProperty({type: TranslationsDto, required: true})
    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        name: TranslationsDto;

    @ApiProperty({ type: TranslationsDto, required: true })
    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        description: TranslationsDto;

}
