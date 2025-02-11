import { OrderStatus, Region } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class OrderUpdateDto {

    @IsOptional()
    @IsString()
        phoneNumber: string;
    @IsOptional()
    @IsString()
        firstName: string;
    @IsOptional()
    @IsEnum(Region)
        region: Region;

}
export class OrderDetailsUpdateDto {

    @IsOptional()
    @IsNumber()
        productPrice: number;
    @IsOptional()
    @IsNumber()
        quantity: number;

}

export class OrderStatusUpdateDto {

    @IsEnum(OrderStatus)
        status: OrderStatus;

}
