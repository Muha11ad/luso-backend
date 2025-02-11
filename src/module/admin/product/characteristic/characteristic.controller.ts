import { Response } from "express";
import { AuthGuard } from "../../auth";
import { ReqIdDto } from "@/shared/dto";
import { IdReq } from "@/shared/utils/types";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { CharacteristicService } from "./characteristic.service";
import { CharacteristicCreateDto, CharacteristicUpdateDto } from "./dto";
import { CharacteristicCreateReq, CharacteristicUpdateReq } from "./characteristic.interface";
import { Put, Body, Post, Param, Delete, UseGuards, Controller, Res, HttpStatus } from "@nestjs/common";

@Controller(ENDPOINTS.characteristic)
export class CharacteristicController {

  constructor(private readonly characteristicService: CharacteristicService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Res() res: Response, @Body() body: CharacteristicCreateDto) {

    const requestData: CharacteristicCreateReq = body;

    const { errId, data } = await this.characteristicService.create(requestData);

    if (data) {

      return res.status(HttpStatus.CREATED).jsonp(setResult(data, errId));

    }

    return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(data, errId));

  }

  @Put("/:id")
  @UseGuards(AuthGuard)
  async update(@Res() res: Response, @Param() param: ReqIdDto, @Body() body: CharacteristicUpdateDto) {

    const requestData: CharacteristicUpdateReq = {
      ...body,
      id: param.id
    }

    const { errId, data } = await this.characteristicService.update(requestData);

    if (errId) {

      return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(data, errId));

    }

    return res.status(HttpStatus.OK).jsonp(setResult(data, errId));

  }

  @Delete("/:id")
  @UseGuards(AuthGuard)
  async delete(@Res() res: Response, @Param() param: ReqIdDto) {

    const requestData: IdReq = param;

    const { errId, data } = await this.characteristicService.delete(requestData);

    if (errId) {

      return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(data, errId));

    }

    return res.status(HttpStatus.OK).jsonp(setResult(data, errId));

  }
}
