import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ReqIdDto {

    @ApiProperty({ type: String, required: true })
    @IsUUID()
        id: string;

}
