import { Module } from "@nestjs/common";
import { ProvidersModule } from "@/shared/providers";
import { OrderController } from "./order.controller";
import { OrderFindService, OrderLifecycleService } from "@/module/admin/order/service";

@Module({
    imports: [ProvidersModule],
    controllers: [OrderController],
    providers: [OrderFindService, OrderLifecycleService]
})
export class LandingOrderModule { }
