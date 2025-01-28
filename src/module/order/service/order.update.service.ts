import { IdDto } from '@/common/dto';
import { Order } from '@prisma/client';
import { ORDER_MESSAGE } from '../order.const';
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
      throw new BadGatewayException(ORDER_MESSAGE.error_update);
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
      throw new BadGatewayException(ORDER_MESSAGE.error_update_status);
    }
  }

  async updateOrderDetails({ id }: IdDto, data: OrderDetailsUpdateDto): Promise<Order> {
    const existingOrderDetails = await this.database.orderDetails.findUnique({
      where: { id },
    });

    if (!existingOrderDetails) {
      throw new NotFoundException(ORDER_MESSAGE.error_details_not_found);
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
      throw new BadGatewayException(ORDER_MESSAGE.error_update_details);
    }
  }
}
