import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class TelegramIdDto {

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ type: Number, required: true })
        telegramId: number;

}
