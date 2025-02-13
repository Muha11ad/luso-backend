import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { TranslationsDto } from "@/shared/dto";
import { IsNotEmpty, IsObject, ValidateNested } from "class-validator";

export class CategoryCreateDto {

    @IsObject()
    @IsNotEmpty()
    @Type(() => TranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: TranslationsDto, required: true })
        name: TranslationsDto;

    @IsNotEmpty()
    @IsObject({})
    @Type(() => TranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: TranslationsDto, required: true })
        description: TranslationsDto;

}
