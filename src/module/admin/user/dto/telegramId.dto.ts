import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TelegramIdDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
    telegramId: string;

}
