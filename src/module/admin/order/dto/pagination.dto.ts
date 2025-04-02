import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class PaginationDto {

    @Min(1)
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({ type: Number, default: 1 })
        page: number;
    @Max(20)
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({ type: Number, default: 10 })    
        perPage: number;
}