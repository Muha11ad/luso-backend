import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { TranslationsDto } from "@/shared/dto";
import { Min, IsNumber, IsObject, IsString, IsBoolean, IsOptional, IsNotEmpty, ValidateNested } from "class-validator";

export class ProductCreateDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        name: string;

    @Min(0)
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ type: Number, required: true })
        price: number;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ type: Boolean, required: true })
        available: boolean;

    @Min(0)
    @IsNumber()
    @IsOptional()
    @ApiProperty({ type: Number, required: false , default: 0 })
        discount = 0;


    @IsObject()
    @IsNotEmpty()
    @Type(() => TranslationsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: TranslationsDto, required: true })
        instruction: TranslationsDto;

}
