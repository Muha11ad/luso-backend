import { ReqIdDto } from "@/shared/dto";
import { TelegramIdDto } from "../user/dto";
import { PaginationDto } from "./dto/pagination.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CacheDelete } from "@/shared/decorators/cache.decorator";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { handlePagination, setResult } from "@/shared/utils/helpers";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { OrderFindService, OrderUpdateService, OrderLifecycleService } from "./service";
import { OrderCreateDto, OrderUpdateDto, OrderStatusUpdateDto, OrderDetailsUpdateDto } from "./dto";
import { Put, Get, Body, Post, Param, Delete, Controller, Res, Patch, Query, UseInterceptors } from "@nestjs/common";
import { OrderCreateReq, OrderDetailsUpdateReq, OrderGetAllReq, OrderGetByUserIdReq, OrderIdReq, OrderUpdateReq, OrderUpdateStatusReq } from "./order.interface";

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
  @CacheKey(REDIS_ENDPOINT_KEYS.ordersAll)
  @UseInterceptors(CacheInterceptor)
  async getAllOrders(@Query() query: PaginationDto) {

    const reqData: OrderGetAllReq = {
      pagination: handlePagination(query)
    }

    const { errId, data, total } = await this.findService.findAll(reqData);

    return setResult({ total, orders: data }, errId);

  }

  @Get(":id")
  async getById(@Param() param: ReqIdDto) {

    const requestData: OrderIdReq = param

    const { errId, data } = await this.findService.findById(requestData);

    return setResult(data, errId);

  }

  @Get("user/:telegramId")
  async getByUserId(@Param() param: TelegramIdDto) {

    const requestData: OrderGetByUserIdReq = {
      userId: param.telegramId
    }

    const { errId, data } = await this.findService.findByUserId(requestData);

    return setResult(data, errId);

  }

  @Post()
  async createOrder(@Body() body: OrderCreateDto) {

    const requestData: OrderCreateReq = body

    const { errId, data } = await this.lifecycleService.create(requestData);

    return setResult(data, errId);

  }

  @Delete(":id")
  @CacheDelete(REDIS_ENDPOINT_KEYS.ordersAll)
  async deleteOrder(@Param() param: ReqIdDto) {

    const requestData: OrderIdReq = param

    const { errId, data } = await this.lifecycleService.delete(requestData);

    return setResult(data, errId);

  }

  @Put(":id")
  @CacheDelete(REDIS_ENDPOINT_KEYS.ordersAll)
  async updateOrder(@Param() param: ReqIdDto, @Body() body: OrderUpdateDto) {

    const requestData: OrderUpdateReq = {
      ...body,
      id: param.id
    }

    const { errId, data } = await this.updateService.update(requestData);

    return setResult(data, errId);

  }

  @Patch("status/:id")
  @CacheDelete(REDIS_ENDPOINT_KEYS.ordersAll)
  async updateOrderStatus(@Param() param: ReqIdDto, @Body() body: OrderStatusUpdateDto) {

    const requestData: OrderUpdateStatusReq = {
      ...body,
      id: param.id
    }

    const { errId, data } = await this.updateService.updateStatus(requestData);

    return setResult(data, errId);

  }

  @Put(":id/details")
  @CacheDelete(REDIS_ENDPOINT_KEYS.ordersAll)
  async updateOrderDetails(@Param() param: ReqIdDto, @Body() body: OrderDetailsUpdateDto
  ) {

    const requestData: OrderDetailsUpdateReq = {
      ...body,
      id: param.id
    }

    const { errId, data } = await this.updateService.updateDetails(requestData);

    return setResult(data, errId);

  }
}
