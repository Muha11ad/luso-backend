import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { TranslationsDto } from "@/shared/dto";
import { Min, IsNumber, IsObject, IsString, IsBoolean, IsOptional, IsNotEmpty, ValidateNested } from "class-validator";

export class ProductCreateDto {

    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsString()
        name: string;

    @ApiProperty({ type: Number, required: true })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
        price: number;

    @ApiProperty({ type: Boolean, required: true })
    @IsNotEmpty()
    @IsBoolean()
        available: boolean;

    @ApiProperty({ type: Number, required: false , default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
        discount = 0;


    @ApiProperty({ type: TranslationsDto, required: true })
    @IsNotEmpty()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => TranslationsDto)
        instruction: TranslationsDto;

}
