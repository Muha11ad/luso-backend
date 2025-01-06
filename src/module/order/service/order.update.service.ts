import { IdDto } from '@/common/dto';
import { Order } from '@prisma/client';
import { OrderExceptionErrorType } from '../types';
import { OrderDetailsUpdateEntity } from '../entity';
import { OrderBaseService } from './order.base.service';
import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderUpdateDto, OrderStatusUpdateDto, OrderDetailsUpdateDto } from '../dto';

@Injectable()
export class OrderUpdateService extends OrderBaseService {
  async updateOrder({ id }: IdDto, data: OrderUpdateDto): Promise<Order> {
    await this.checkOrderExistAndThrowException(id);
    try {
      return await this.database.order.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      throw new BadGatewayException(
        `${OrderExceptionErrorType.ERROR_WHILE_UPDATING_ORDER} : ${error.message}`,
      );
    }
  }

  async updateOrderStatus({ id }: IdDto, { status }: OrderStatusUpdateDto): Promise<Order> {
    await this.checkOrderExistAndThrowException(id);
    try {
      return await this.database.order.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
    } catch (error) {
      throw new BadGatewayException(
        `${OrderExceptionErrorType.ERROR_WHILE_UPDATING_ORDER_STATUS} : ${error.message}`,
      );
    }
  }

  async updateOrderDetails({ id }: IdDto, data: OrderDetailsUpdateDto): Promise<Order> {
    const existingOrderDetails = await this.database.orderDetails.findUnique({
      where: { id },
    });

    if (!existingOrderDetails) {
      throw new NotFoundException(OrderExceptionErrorType.ORDER_DETAILS_NOT_FOUND);
    }

    try {
      const orderDetailsEntity = new OrderDetailsUpdateEntity(
        existingOrderDetails.quantity,
        existingOrderDetails.product_price,
      );

      if (data.quantity !== undefined) {
        orderDetailsEntity.updateQuantity(data.quantity);
      }

      if (data.product_price !== undefined) {
        orderDetailsEntity.updateProductPrice(data.product_price);
      }

      const updatedOrderDetails = await this.database.orderDetails.update({
        where: { id },
        data: {
          ...data,
          total_price: orderDetailsEntity.getTotalPrice(),
        },
      });

      const priceDifference = orderDetailsEntity.getTotalPrice() - existingOrderDetails.total_price;

      const updatedOrder = await this.database.order.update({
        where: {
          id: updatedOrderDetails.order_id,
        },
        data: {
          total_price: {
            increment: priceDifference,
          },
        },
      });

      return updatedOrder;
    } catch (error) {
      throw new BadGatewayException(
        `${OrderExceptionErrorType.ERROR_WHILE_UPDATING_ORDER_DETAILS} : ${error.message}`,
      );
    }
  }
}
