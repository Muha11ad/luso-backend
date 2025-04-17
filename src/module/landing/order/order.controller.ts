import { ApiTags } from "@nestjs/swagger";
import { Public } from "@/shared/decorators";
import { setResult } from "@/shared/utils/helpers";
import { TelegramIdDto } from "@/module/admin/user/dto";
import { OrderCreateDto } from "@/module/admin/order/dto";
import { CacheDelete } from "@/shared/decorators/cache.decorator";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { Body, Controller, Get, Param, Post, UseInterceptors, } from "@nestjs/common";
import { OrderFindService, OrderLifecycleService } from "@/module/admin/order/service";
import { OrderCreateReq, OrderGetByUserIdReq } from "@/module/admin/order/order.interface";
import { CacheDeleteInterceptor } from "@/shared/interceptors/cache.delete.interceptor";

@Public()
@Controller()
@ApiTags(ENDPOINTS.order)
export class OrderController {

  constructor(
    private readonly findService: OrderFindService,
    private readonly lifecycleService: OrderLifecycleService
  ) { }


  @Get("user/:telegramId")
  async getByUserId(@Param() param: TelegramIdDto) {

    const requestData: OrderGetByUserIdReq = {
      userId: param.telegramId
    }

    const { errId, data } = await this.findService.findByUserId(requestData);

    return setResult({ orders: data }, errId);

  }

  @Post()
  @UseInterceptors(CacheDeleteInterceptor)
  @CacheDelete(REDIS_ENDPOINT_KEYS.ordersAll, REDIS_ENDPOINT_KEYS.ordersTotal)
  async createOrder(@Body() body: OrderCreateDto) {

    const requestData: OrderCreateReq = body

    const { errId, data } = await this.lifecycleService.create(requestData);

    return setResult({ orders: data }, errId);

  }

}
