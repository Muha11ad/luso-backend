import { ReqIdDto } from "@/shared/dto";
import { TelegramIdDto } from "../user/dto";
import { setResult } from "@/shared/utils/helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CacheDelete } from "@/shared/decorators/cache.decorator";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { CacheDeleteInterceptor } from "@/shared/interceptors/cache.delete.interceptor";
import { OrderFindService, OrderUpdateService, OrderLifecycleService } from "./service";
import { OrderCreateDto, OrderUpdateDto, OrderStatusUpdateDto, OrderDetailsUpdateDto } from "./dto";
import { Put, Get, Body, Post, Param, Delete, Controller, Patch, UseInterceptors } from "@nestjs/common";
import { OrderCreateReq, OrderDetailsUpdateReq, OrderGetByUserIdReq, OrderIdReq, OrderUpdateReq, OrderUpdateStatusReq } from "./order.interface";

@Controller()
@ApiBearerAuth()
@ApiTags(ENDPOINTS.order)
export class OrderController {

  constructor(
    private readonly findService: OrderFindService,
    private readonly updateService: OrderUpdateService,
    private readonly lifecycleService: OrderLifecycleService
  ) { }

  @Get('all')
  @UseInterceptors(CacheInterceptor)
  @CacheKey(REDIS_ENDPOINT_KEYS.ordersAll)
  async getAllOrders() {

    const { errId, data, total } = await this.findService.findAll();

    return setResult({ total, orders: data }, errId);

  }


  @Get("total")
  @UseInterceptors(CacheInterceptor)
  @CacheKey(REDIS_ENDPOINT_KEYS.ordersTotal)
  async getTotalOrders() {

    const { errId, data } = await this.findService.findTotalOrders();

    return setResult({ orders: data }, errId);

  }

  @Get(":id")
  async getById(@Param() param: ReqIdDto) {

    const requestData: OrderIdReq = param

    const { errId, data } = await this.findService.findById(requestData);

    return setResult({ orders: data }, errId);

  }

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

  @Delete(":id")
  @UseInterceptors(CacheDeleteInterceptor)
  @CacheDelete(REDIS_ENDPOINT_KEYS.ordersAll, REDIS_ENDPOINT_KEYS.ordersTotal)
  async deleteOrder(@Param() param: ReqIdDto) {

    const requestData: OrderIdReq = param

    const { errId, data } = await this.lifecycleService.delete(requestData);

    return setResult({ orders: data }, errId);

  }

  @Put(":id")
  @UseInterceptors(CacheDeleteInterceptor)
  @CacheDelete(REDIS_ENDPOINT_KEYS.ordersAll, REDIS_ENDPOINT_KEYS.ordersTotal)
  async updateOrder(@Param() param: ReqIdDto, @Body() body: OrderUpdateDto) {

    const requestData: OrderUpdateReq = {
      ...body,
      id: param.id
    }

    const { errId, data } = await this.updateService.update(requestData);

    return setResult({ orders: data }, errId);

  }

  @Patch("status/:id")
  @UseInterceptors(CacheDeleteInterceptor)
  @CacheDelete(REDIS_ENDPOINT_KEYS.ordersAll, REDIS_ENDPOINT_KEYS.ordersTotal)
  async updateOrderStatus(@Param() param: ReqIdDto, @Body() body: OrderStatusUpdateDto) {

    const requestData: OrderUpdateStatusReq = {
      ...body,
      id: param.id
    }

    const { errId, data } = await this.updateService.updateStatus(requestData);

    return setResult({ orders: data }, errId);

  }

  @Put(":id/details")
  @UseInterceptors(CacheDeleteInterceptor)
  @CacheDelete(REDIS_ENDPOINT_KEYS.ordersAll, REDIS_ENDPOINT_KEYS.ordersTotal)
  async updateOrderDetails(@Param() param: ReqIdDto, @Body() body: OrderDetailsUpdateDto
  ) {

    const requestData: OrderDetailsUpdateReq = {
      ...body,
      id: param.id
    }

    const { errId, data } = await this.updateService.updateDetails(requestData);

    return setResult({ orders: data }, errId);

  }
  

}
