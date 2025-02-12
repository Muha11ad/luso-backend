import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus, Region } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class OrderDetailsDto {

    @ApiProperty({ type: Number, required: true })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @ApiProperty({ type: Number, required: true })
    @IsNotEmpty()
    @IsNumber()
    productPrice: number;

    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsString()
    productId: string;

    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsString()
    productName: string;

}

export class OrderCreateDto {

    @ApiProperty({ type: Number, required: true })
    @IsNotEmpty()
    @IsNumber()
        userId: number;

    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsString()
        phoneNumber: string;

    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsString()
        firstName: string;

    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsEnum(Region)
        region: Region;

    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsEnum(OrderStatus)
        status: OrderStatus;

    @ApiProperty({ type: OrderDetailsDto, required: true, isArray: true })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
        orderDetails: OrderDetailsDto[];

}
