import { ReqIdDto } from "@/shared/dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class ProductUpdateDiscountDto extends ReqIdDto {

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ type: Number, required: true })
        discount: number;
       
}
