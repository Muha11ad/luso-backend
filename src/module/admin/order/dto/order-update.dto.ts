import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus, Region } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class OrderUpdateDto {

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
        phoneNumber: string;
      
    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
        firstName: string;
    
    @ApiProperty({ enum: Region, required: false })
    @IsOptional()
    @IsEnum(Region)
        region: Region;

}
export class OrderDetailsUpdateDto {

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsNumber()
        productPrice: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsNumber()
        quantity: number;

}

export class OrderStatusUpdateDto {

    @ApiProperty({ enum: OrderStatus, required: true })
    @IsEnum(OrderStatus)
        status: OrderStatus;

}
