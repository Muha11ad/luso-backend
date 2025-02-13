import { Response } from "express";
import { ReqIdDto } from "@/shared/dto";
import { IdReq } from "@/shared/utils/types";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CharacteristicService } from "./characteristic.service";
import { CharacteristicCreateDto, CharacteristicUpdateDto } from "./dto";
import { CharacteristicCreateReq, CharacteristicUpdateReq } from "./characteristic.interface";
import { Put, Body, Post, Param, Delete, Controller, Res, HttpStatus } from "@nestjs/common";

@ApiBearerAuth()
@Controller(ENDPOINTS.characteristic)
@ApiTags(`${ENDPOINTS.product}/${ENDPOINTS.characteristic}`)
export class CharacteristicController {

  constructor(private readonly characteristicService: CharacteristicService) { }

  @Post()
  async create(@Res() res: Response, @Body() body: CharacteristicCreateDto) {

    const requestData: CharacteristicCreateReq = body;

    const { errId, data } = await this.characteristicService.create(requestData);

    if (data) {

      return res.status(HttpStatus.CREATED).jsonp(setResult(data, errId));

    }

    return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(data, errId));

  }

  @Put("/:id")
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
  async delete(@Res() res: Response, @Param() param: ReqIdDto) {

    const requestData: IdReq = param;

    const { errId, data } = await this.characteristicService.delete(requestData);

    if (errId) {

      return res.status(HttpStatus.BAD_REQUEST).jsonp(setResult(data, errId));

    }

    return res.status(HttpStatus.OK).jsonp(setResult(data, errId));

  }
}
