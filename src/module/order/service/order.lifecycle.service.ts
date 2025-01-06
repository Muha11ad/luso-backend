import { Order, User } from '@prisma/client';
import { OrderCreateDto } from '../dto';
import { OrderExceptionErrorType } from '../types';
import { OrderBaseService } from './order.base.service';
import { UserExceptionErrorTypes } from '@/module/user/types';
import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderCreateEntity } from '../entity';

@Injectable()
export class OrderLifecycleService extends OrderBaseService {
  private async checkUserExist(id: number | string): Promise<User> {
    const userExist = await this.database.user.findUnique({
      where: {
        telegram_id: Number(id),
      },
    });
    if (userExist === null) {
      throw new NotFoundException(UserExceptionErrorTypes.NOT_FOUND);
    }
    return userExist;
  }

  private async checkProductExists(orderDetails): Promise<void> {
    for (const detail of orderDetails) {
      const productExist = await this.database.product.findUnique({
        where: {
          id: detail.product_id,
        },
      });
      if (!productExist) {
        throw new NotFoundException(`Product with ID ${detail.product_id} not found`);
      }
    }
  }

  async create(data: OrderCreateDto): Promise<Order> {
    const userExist = await this.checkUserExist(data.user_id);
    await this.checkProductExists(data.orderDetails);
    try {
      const newOrder = new OrderCreateEntity(data);
      return this.database.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
          data: newOrder.toPrisma(),
        });

        const detailsWithOrderId = newOrder.toOrderDetails().map((detail) => ({
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
