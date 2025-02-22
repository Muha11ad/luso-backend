import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { TelegramIdDto } from "@/module/admin/user/dto";
import { OrderCreateDto } from "@/module/admin/order/dto";
import { Body, Controller, Get, HttpStatus, Param, Post, Res } from "@nestjs/common";
import { OrderFindService, OrderLifecycleService } from "@/module/admin/order/service";
import { OrderCreateReq, OrderGetByUserIdReq } from "@/module/admin/order/order.interface";
import { Public } from "@/shared/decorators";

@Controller()
@ApiTags(ENDPOINTS.order)
@Public()
export class OrderController {

  constructor(
    private readonly findService: OrderFindService,
    private readonly lifecycleService: OrderLifecycleService
  ) { }


  @Get("user/:telegramId")
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

    return res.status(HttpStatus.CREATED).jsonp(setResult(data, null));

  }

}
