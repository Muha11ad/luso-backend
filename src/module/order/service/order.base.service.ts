import { OrderExceptionErrorType } from '../types';
import { DatabaseService } from '@/common/services';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class OrderBaseService {
  constructor(public database: DatabaseService) {}

  public async checkOrderExistAndThrowException(id: string): Promise<void> {
    const order = await this.database.order.findUnique({
      where: {
        id,
      },
    });
    if (order === null) {
      throw new NotFoundException(OrderExceptionErrorType.ORDER_ID_NOT_FOUND);
    }
  }
}
