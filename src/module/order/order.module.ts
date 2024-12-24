import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { CommonServiceModule } from '@/common';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';

@Module({
  imports: [CommonServiceModule, AuthModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
