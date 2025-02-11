import { Type } from "class-transformer";
import { TranslationsDto } from "@/shared/dto";
import { Min, IsNumber, IsObject, IsString, IsBoolean, IsOptional, IsNotEmpty, ValidateNested} from "class-validator";

export class ProductCreateDto {

    @IsNotEmpty()
    @IsString()
        name: string;

    @IsNumber()
    @IsNotEmpty()
        price: number;

    @IsNotEmpty()
    @IsBoolean()
        available: boolean;

    @IsOptional()
    @IsNumber()
    @Min(0)
        discount: number;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => TranslationsDto)
        instruction: TranslationsDto;

}
