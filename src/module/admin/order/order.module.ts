import { AuthModule } from "../auth";
import { Module } from "@nestjs/common";
import { ProvidersModule } from "@/shared/providers";
import { OrderController } from "./order.controller";
import { OrderBaseService, OrderFindService, OrderUpdateService, OrderLifecycleService } from "./service";

@Module({
    imports: [ProvidersModule, AuthModule],
    controllers: [OrderController],
    providers: [OrderBaseService, OrderFindService, OrderUpdateService, OrderLifecycleService,]
})
export class OrderModule { }
