import { ORDER_MESSAGE } from '../order.const';
import { DatabaseProvider } from '@/common/providers';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class OrderBaseService {
  constructor(public database: DatabaseProvider) {}

  public async checkOrderExistAndThrowException(id: string): Promise<void> {
    const order = await this.database.order.findUnique({
      where: {
        id,
      },
    });
    if (order === null) {
      throw new NotFoundException(ORDER_MESSAGE.error_not_found);
    }
  }
}
