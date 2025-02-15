import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
    refreshToken: string;

}