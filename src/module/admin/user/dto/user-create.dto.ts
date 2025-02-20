import { ApiProperty } from "@nestjs/swagger";
import { TelegramIdDto } from "./telegramId.dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserCreateDto extends TelegramIdDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        name: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String, required: true })
        username: string;

}
