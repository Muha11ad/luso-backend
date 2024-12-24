import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';

@Module({
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
