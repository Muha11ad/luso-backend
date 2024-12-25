import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { IOrderService } from './order.serivce.interface';
import { DatabaseService } from '@/common/services';
import { Order } from '@prisma/client';
import { IdDto } from '@/common/dto';
import { OrderExceptionErrorType } from '../types';
import {
  OrderCreateDto,
  OrderDetailsUpdateDto,
  OrderStatusUpdateDto,
  OrderUpdateDto,
} from '../dto';
import { UserExceptionErrorTypes } from '@/module/user/types';

@Injectable()
export class OrderService implements IOrderService {
  constructor(private readonly database: DatabaseService) {}

  private async checkOrderExistAndThrowException(id: string): Promise<void> {
    const order = await this.database.order.findUnique({
      where: {
        id,
      },
    });
    if (order === null) {
      throw new NotFoundException(OrderExceptionErrorType.ORDER_ID_NOT_FOUND);
    }
  }

  async findAll(): Promise<Order[]> {
    return await this.database.order.findMany({
      include: {
        OrderDetails: true,
      },
    });
  }

  async findById({ id }: IdDto): Promise<Order> {
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

  // check product exists
  async create(data: OrderCreateDto): Promise<Order> {
    const userExist = await this.database.user.findUnique({
      where: {
        telegram_id: Number(data.user_id),
      },
    });
    if (userExist === null) {
      throw new NotFoundException(UserExceptionErrorTypes.NOT_FOUND);
    }
    try {
      const { orderDetails, ...orderData } = data;
      const completedOrderDetails = orderDetails.map((detail) => ({
        ...detail,
        total_price: detail.product_price * detail.quantity,
      }));
      const totalPrice = completedOrderDetails.reduce((acc, detail) => acc + detail.total_price, 0);
      return this.database.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
          data: {
            user_id: Number(orderData.user_id),
            phone_number: orderData.phone_number,
            total_price: totalPrice,
            first_name: orderData.first_name,
            region: orderData.region,
            status: orderData.status,
          },
        });
        const detailsWithOrderId = completedOrderDetails.map((detail) => ({
          ...detail,
          order_id: createdOrder.id,
        }));

        await tx.orderDetails.createMany({
          data: detailsWithOrderId,
        });

        return createdOrder;
      });
    } catch (error) {
      throw new BadGatewayException(
        `${OrderExceptionErrorType.ERROR_WHILE_CREATING_ORDER} : ${error.message}`,
      );
    }
  }

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
      let updatedOrderDetailsTotalPrice = 0;
      if (data['quantity'] && data['product_price']) {
        updatedOrderDetailsTotalPrice = data.quantity * data.product_price;
      } else if (data['quantity']) {
        updatedOrderDetailsTotalPrice = data.quantity * existingOrderDetails.product_price;
      } else if (data['product_price']) {
        updatedOrderDetailsTotalPrice = existingOrderDetails.quantity * data.product_price;
      }

      const updatedOrderDetails = await this.database.orderDetails.update({
        where: { id },
        data: {
          ...data,
          total_price: updatedOrderDetailsTotalPrice,
        },
      });

      const priceDifference = updatedOrderDetailsTotalPrice - existingOrderDetails.total_price;

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

  async delete({ id }: IdDto): Promise<Order> {
    await this.checkOrderExistAndThrowException(id);
    try {
      return await this.database.order.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new BadGatewayException(
        `${OrderExceptionErrorType.ERROR_WHILE_DELETING_ORDER} :  ${error.message}`,
      );
    }
  }
}
