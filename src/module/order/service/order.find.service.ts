import { Order } from '@prisma/client';
import { OrderExceptionErrorType } from '../types';
import { OrderBaseService } from './order.base.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class OrderFindService extends OrderBaseService {
  async findAll(): Promise<Order[]> {
    return await this.database.order.findMany({
      include: {
        OrderDetails: true,
      },
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.database.order.findUnique({
      where: {
        id,
      },
      include: {
        OrderDetails: true,
      },
    });
    if (order === null) {
      throw new NotFoundException(OrderExceptionErrorType.ORDER_ID_NOT_FOUND);
    }
    return order;
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return await this.database.order.findMany({
      where: {
        user_id: userId,
      },
      include: {
        OrderDetails: true,
      },
    });
  }
}
