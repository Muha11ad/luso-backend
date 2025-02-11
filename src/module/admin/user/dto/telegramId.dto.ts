import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class TelegramIdDto {

    @IsNotEmpty()
    @IsString()
    @Type(() => Number)
    telegramId: number;

}
