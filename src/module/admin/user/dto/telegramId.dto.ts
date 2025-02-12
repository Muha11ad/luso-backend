import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TelegramIdDto {

    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsString()
    @Type(() => Number)
        telegramId: number;

}
