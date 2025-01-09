import {
  OrderCreateDto,
  OrderUpdateDto,
  OrderStatusUpdateDto,
  OrderDetailsUpdateDto,
} from '../dto';
import { IdDto } from '@/common/dto';
import { Order } from '@prisma/client';
import { AuthGuard } from '@/module/auth';
import { TelegramIdDto } from '@/module/user/dto';
import { IOrderController } from './order.controller.interface';
import { OrderFindService, OrderLifecycleService, OrderUpdateService } from '../service';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SUCCESS_MESSAGES } from '../types';

@Controller('order')
export class OrderController implements IOrderController {
  constructor(
    private readonly findService: OrderFindService,
    private readonly updateService: OrderUpdateService,
    private readonly lifecycleService: OrderLifecycleService,
  ) {}
  @Get()
  @UseGuards(AuthGuard)
  async getAllOrders(): Promise<Order[]> {
    return this.findService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getById(@Param() param: IdDto): Promise<Order> {
    return this.findService.findById(param.id);
  }

  @Get('user/:telegram_id')
  async getByUserId(@Param() param: TelegramIdDto): Promise<Order[]> {
    return this.findService.findByUserId(Number(param.telegram_id));
  }

  @Post()
  async createOrder(@Body() data: OrderCreateDto): Promise<string> {
    await this.lifecycleService.create(data);
    return SUCCESS_MESSAGES.ORDER_CREATED;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteOrder(@Param() param: IdDto): Promise<Order> {
    return this.lifecycleService.delete(param.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateOrder(@Param() param: IdDto, @Body() data: OrderUpdateDto): Promise<Order> {
    return this.updateService.updateOrder(param, data);
  }

  @Put(':id/status')
  @UseGuards(AuthGuard)
  async updateOrderStatus(
    @Param() param: IdDto,
    @Body() data: OrderStatusUpdateDto,
  ): Promise<Order> {
    return this.updateService.updateOrderStatus(param, data);
  }

  @Put(':id/details')
  @UseGuards(AuthGuard)
  async updateOrderDetails(
    @Param() param: IdDto,
    @Body() data: OrderDetailsUpdateDto,
  ): Promise<Order> {
    return this.updateService.updateOrderDetails(param, data);
  }
}
