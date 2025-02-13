import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UserCreateDto {

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    @ApiProperty({ type: Number, required: true })
        telegramId: number;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        name: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String, required: true })
        username: string;

}
