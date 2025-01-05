import { Order } from '@prisma/client';
import { OrderCreateDto } from '../dto';
import { OrderExceptionErrorType } from '../types';
import { OrderBaseService } from './order.base.service';
import { UserExceptionErrorTypes } from '@/module/user/types';
import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class OrderLifecycleService extends OrderBaseService {
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
            user_id: userExist.telegram_id,
            phone_number: orderData.phone_number,
            total_price: totalPrice,
            first_name: orderData.first_name,
            region: orderData.region,
            status: orderData.status,
            delivery_fee: 20000,
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

  async delete(id: string): Promise<Order> {
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
