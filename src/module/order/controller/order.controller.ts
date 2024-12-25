import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { IOrderController } from './order.controller.interface';
import { AuthGuard } from '@/module/auth';
import { IdDto } from '@/common/dto';
import { Order } from '@prisma/client';
import {
  OrderCreateDto,
  OrderDetailsUpdateDto,
  OrderStatusUpdateDto,
  OrderUpdateDto,
} from '../dto';
import { TelegramIdDto } from '@/module/user/dto';

@Controller('order')
export class OrderController implements IOrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  @UseGuards(AuthGuard)
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getById(@Param() param: IdDto): Promise<Order> {
    return this.orderService.findById(param);
  }

  @Get('user/:telegram_id')
  async getByUserId(@Param() param: TelegramIdDto): Promise<Order[]> {
    return this.orderService.findByUserId(Number(param.telegram_id));
  }

  @Post()
  async createOrder(@Body() data: OrderCreateDto): Promise<Order> {
    return this.orderService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateOrder(@Param() param: IdDto, @Body() data: OrderUpdateDto): Promise<Order> {
    return this.orderService.updateOrder(param, data);
  }

  @Put(':id/status')
  @UseGuards(AuthGuard)
  async updateOrderStatus(
    @Param() param: IdDto,
    @Body() data: OrderStatusUpdateDto,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(param, data);
  }

  @Put(':id/details')
  @UseGuards(AuthGuard)
  async updateOrderDetails(
    @Param() param: IdDto,
    @Body() data: OrderDetailsUpdateDto,
  ): Promise<Order> {
    return this.orderService.updateOrderDetails(param, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteOrder(@Param() param: IdDto): Promise<Order> {
    return this.orderService.delete(param);
  }
}
