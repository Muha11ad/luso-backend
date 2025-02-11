import { Type } from "class-transformer";
import { TranslationsDto } from "@/shared/dto";
import { IsNotEmpty, IsObject } from "class-validator";

export class CategoryCreateDto {

    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        name: TranslationsDto;

    @IsNotEmpty()
    @IsObject()
    @Type(() => TranslationsDto)
        description: TranslationsDto;

}
