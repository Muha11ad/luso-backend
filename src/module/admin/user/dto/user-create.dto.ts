import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UserCreateDto {

    @IsNumber()
    @IsNotEmpty()
        telegramId: number;
    @IsNotEmpty()
    @IsString()
        name: string;
    @IsOptional()
    @IsString()
        username: string;

}
