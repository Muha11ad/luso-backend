import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UserCreateDto {

    @ApiProperty({ type: Number, required: true })
    @IsNumber()
    @IsNotEmpty()
        telegramId: number;
    
    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsString()
        name: string;

    @ApiProperty({ type: String, required: true })
    @IsOptional()
    @IsString()
        username: string;

}
