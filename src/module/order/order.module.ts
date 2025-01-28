import {
  OrderBaseService,
  OrderFindService,
  OrderUpdateService,
  OrderLifecycleService,
} from './service';
import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { ProvidersModule } from '@/common/providers';
import { OrderController } from './controller/order.controller';

@Module({
  imports: [ProvidersModule, AuthModule],
  controllers: [OrderController],
  providers: [OrderBaseService, OrderLifecycleService, OrderFindService, OrderUpdateService],
})
export class OrderModule {}
