import { ReqIdDto } from "@/shared/dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class ProductUpdateAvailableDto extends ReqIdDto {

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ type: Boolean, required: true })
        available: boolean;
       
}
