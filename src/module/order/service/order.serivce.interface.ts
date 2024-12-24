import { Order, OrderStatus } from '@prisma/client';
import { OrderCreateDto } from '../dto';
import { IdDto } from '@/common/dto';

export interface IOrderService {
  getOrders(): Promise<Order[]>;
  deleteOrder: (id: IdDto) => Promise<Order>;
  getOrderById: (id: IdDto) => Promise<Order>;
  create: (data: OrderCreateDto) => Promise<Order>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  updateOrderStatus: (id: IdDto, status: OrderStatus) => Promise<Order>;
  updateOrder: (id: IdDto, data: OrderCreateDto) => Promise<Order>;
  updateOrderDetails: (id: IdDto, data: OrderCreateDto) => Promise<Order>;
}
