import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {

    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsEmail()
        email: string;
    
        @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsString()
        password: string;

}
