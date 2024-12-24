import { OrderStatus, Region } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class OrderDetails {
  @IsNotEmpty()
  @IsUUID()
  order_id: string;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
  @IsNotEmpty()
  @IsString()
  total_price: string;
  @IsNotEmpty()
  @IsString()
  product_id: string;
  @IsNotEmpty()
  @IsString()
  product_name: string;
}

export class OrderCreateDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
  @IsNotEmpty()
  @IsString()
  phone_number: string;
  @IsNotEmpty()
  @IsString()
  total_price: string;
  @IsNotEmpty()
  @IsString()
  first_name: string;
  @IsNotEmpty()
  @IsEnum(Region)
  region: Region;
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
  @IsNotEmpty()
  @IsArray()
  orderDetails: OrderDetails[];
}
