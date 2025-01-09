import { Order } from '@prisma/client';
import {
  OrderCreateDto,
  OrderDetailsUpdateDto,
  OrderStatusUpdateDto,
  OrderUpdateDto,
} from '../dto';
import { IdDto } from '@/common/dto';
import { TelegramIdDto } from '@/module/user/dto';

export interface IOrderController {
  getAllOrders: () => Promise<Order[]>;
  getById: (param: IdDto) => Promise<Order>;
  getByUserId: (param: TelegramIdDto) => Promise<Order[]>;
  deleteOrder: (param: IdDto) => Promise<Order>;
  createOrder: (data: OrderCreateDto) => Promise<string>;
  updateOrder: (param: IdDto, data: OrderUpdateDto) => Promise<Order>;
  updateOrderStatus: (param: IdDto, data: OrderStatusUpdateDto) => Promise<Order>;
  updateOrderDetails: (param: IdDto, data: OrderDetailsUpdateDto) => Promise<Order>;
}
