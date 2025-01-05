import {
  OrderBaseService,
  OrderFindService,
  OrderLifecycleService,
  OrderUpdateService,
} from './service';
import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { CommonServiceModule } from '@/common';
import { OrderController } from './controller/order.controller';

@Module({
  imports: [CommonServiceModule, AuthModule],
  controllers: [OrderController],
  providers: [OrderBaseService, OrderLifecycleService, OrderFindService, OrderUpdateService],
})
export class OrderModule {}
