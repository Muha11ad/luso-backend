import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus, Region } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, ValidateNested } from "class-validator";

export class OrderDetailsDto {

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    @ApiProperty({ type: Number, required: true })
        quantity: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    @ApiProperty({ type: Number, required: true })
    productPrice: number;
    
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
    productId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
    productName: string;

}

export class OrderCreateDto {

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    @ApiProperty({ type: Number, required: true })
        userId: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, required: true })
        phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
        firstName: string;

    @IsNotEmpty()
    @IsEnum(Region)
    @ApiProperty({ enum: Region, required: true })
        region: Region;

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    @ApiProperty({ type: String, required: true })
        status: OrderStatus;

    @IsArray()
    @IsNotEmpty()
    @Type(() => OrderDetailsDto)
    @ValidateNested({ each: true })
    @ApiProperty({ type: OrderDetailsDto, required: true, isArray: true })
        orderDetails: OrderDetailsDto[];

}
