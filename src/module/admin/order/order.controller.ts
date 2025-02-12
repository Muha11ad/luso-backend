import { Response } from "express";
import { ReqIdDto } from "@/shared/dto";
import { TelegramIdDto } from "../user/dto";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { OrderFindService, OrderUpdateService, OrderLifecycleService } from "./service";
import { OrderCreateDto, OrderUpdateDto, OrderStatusUpdateDto, OrderDetailsUpdateDto } from "./dto";
import { Put, Get, Body, Post, Param, Delete, Controller, Res, HttpStatus, Patch } from "@nestjs/common";
import { OrderCreateReq, OrderDetailsUpdateReq, OrderGetByUserIdReq, OrderIdReq, OrderUpdateReq, OrderUpdateStatusReq } from "./order.interface";

@Controller(ENDPOINTS.order)
@ApiTags(ENDPOINTS.order)
@ApiBearerAuth()
export class OrderController {

  constructor(
    private readonly findService: OrderFindService,
    private readonly updateService: OrderUpdateService,
    private readonly lifecycleService: OrderLifecycleService
  ) { }

  @Get('all')
  async getAllOrders(@Res() res: Response) {

    const { errId, data } = await this.findService.findAll();

    if (errId) {

      return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

    }

    return res.status(HttpStatus.OK).jsonp(setResult(data, null));
  }

  @Get(":id")
  async getById(@Res() res: Response, @Param() param: ReqIdDto) {

    const requestData: OrderIdReq = param

    const { errId, data } = await this.findService.findById(requestData);

    if (errId) {

      return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

    }

    return res.status(HttpStatus.OK).jsonp(setResult(data, null));

  }

  @Get("user/:telegram_id")
  async getByUserId(@Res() res: Response, @Param() param: TelegramIdDto) {

    const requestData: OrderGetByUserIdReq = {
      userId: param.telegramId
    }

    const { errId, data } = await this.findService.findByUserId(requestData);

    if (errId) {

      return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

    }

    return res.status(HttpStatus.OK).jsonp(setResult(data, null));

  }

  @Post()
  async createOrder(@Res() res: Response, @Body() body: OrderCreateDto) {

    const requestData: OrderCreateReq = body

    const { errId, data } = await this.lifecycleService.create(requestData);

    if (errId) {

      return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

    }

    return res.status(HttpStatus.OK).jsonp(setResult(data, null));

  }

  @Delete(":id")
  async deleteOrder(@Res() res: Response, @Param() param: ReqIdDto) {

    const requestData: OrderIdReq = param

    const { errId, data } = await this.lifecycleService.delete(requestData);

    if (errId) {

      return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

    }

    return res.status(HttpStatus.OK).jsonp(setResult(data, null));

  }

  @Put(":id")
  async updateOrder(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: OrderUpdateDto) {

    const requestData: OrderUpdateReq = {
      ...body,
      id: param.id
    }

    const { errId, data: result } = await this.updateService.updateOrder(requestData);

    if (errId) {

      return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

    }

    return res.status(HttpStatus.OK).jsonp(setResult(result, null));

  }

  @Patch("status/:id")
  async updateOrderStatus(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: OrderStatusUpdateDto) {

    const requestData: OrderUpdateStatusReq = {
      ...body,
      id: param.id
    }

    const { errId, data } = await this.updateService.updateOrderStatus(requestData);

    if (errId) {

      return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

    }

    return res.status(HttpStatus.OK).jsonp(setResult(data, null));

  }

  @Put(":id/details")
  async updateOrderDetails(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: OrderDetailsUpdateDto
  ) {

    const requestData: OrderDetailsUpdateReq = {
      ...body,
      id: param.id
    }

    const { errId, data } = await this.updateService.updateOrderDetails(requestData);

    if (errId) {

      return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(null, errId));

    }

    return res.status(HttpStatus.OK).jsonp(setResult(data, null));

  }
}
