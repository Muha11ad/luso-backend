import { OrderStatus, Region } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderUpdateDto {
  @IsOptional()
  @IsString()
  phone_number: string;
  @IsOptional()
  @IsString()
  first_name: string;
  @IsOptional()
  @IsEnum(Region)
  region: Region;
}
export class OrderDetailsUpdateDto {
  @IsOptional()
  @IsNumber()
  product_price: number;
  @IsOptional()
  @IsNumber()
  quantity: number;
}

export class OrderStatusUpdateDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
