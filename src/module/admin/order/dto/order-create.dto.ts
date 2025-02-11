import { OrderStatus, Region } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class OrderDetailsDto {

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    productPrice: number;

    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @IsString()
    productName: string;

}

export class OrderCreateDto {

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsEnum(Region)
    region: Region;

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    orderDetails: OrderDetailsDto[];

}
