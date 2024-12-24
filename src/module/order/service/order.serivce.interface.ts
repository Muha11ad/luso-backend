import {
  OrderCreateDto,
  OrderDetailsUpdateDto,
  OrderStatusUpdateDto,
  OrderUpdateDto,
} from '../dto';
import { IdDto } from '@/common/dto';
import { Order } from '@prisma/client';

export interface IOrderService {
  findAll(): Promise<Order[]>;
  delete: (param: IdDto) => Promise<Order>;
  findById: (param: IdDto) => Promise<Order>;
  create: (data: OrderCreateDto) => Promise<Order>;
  findByUserId(userId: number): Promise<Order[]>;
  updateOrder: (param: IdDto, data: OrderUpdateDto) => Promise<Order>;
  updateOrderStatus: (param: IdDto, status: OrderStatusUpdateDto) => Promise<Order>;
  updateOrderDetails: (param: IdDto, data: OrderDetailsUpdateDto) => Promise<Order>;
}
