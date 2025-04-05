import { ReqIdDto } from "@/shared/dto";
import { IdReq } from "@/shared/utils/types";
import { setResult } from "@/shared/utils/helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CharacteristicService } from "./characteristic.service";
import { CacheDelete } from "@/shared/decorators/cache.decorator";
import { ENDPOINTS, REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { CharacteristicCreateDto, CharacteristicUpdateDto } from "./dto";
import { Put, Body, Post, Param, Delete, Controller } from "@nestjs/common";
import { CharacteristicCreateReq, CharacteristicUpdateReq } from "./characteristic.interface";

@ApiBearerAuth()
@Controller(ENDPOINTS.characteristic)
@ApiTags(`${ENDPOINTS.product}/${ENDPOINTS.characteristic}`)
export class CharacteristicController {

  constructor(private readonly characteristicService: CharacteristicService) { }

  @Post()
  @CacheDelete(REDIS_ENDPOINT_KEYS.productAll)
  async create(@Body() body: CharacteristicCreateDto) {

    const requestData: CharacteristicCreateReq = body;

    const { errId, data } = await this.characteristicService.create(requestData);

    return setResult({ chars: data }, errId);

  }

  @Put("/:id")
  @CacheDelete(REDIS_ENDPOINT_KEYS.productAll)
  async update(@Param() param: ReqIdDto, @Body() body: CharacteristicUpdateDto) {

    const requestData: CharacteristicUpdateReq = {
      ...body,
      id: param.id
    }

    const { errId, data } = await this.characteristicService.update(requestData);

    return setResult({ chars: data }, errId);

  }

  @Delete("/:id")
  @CacheDelete(REDIS_ENDPOINT_KEYS.productAll)
  async delete(@Param() param: ReqIdDto) {

    const requestData: IdReq = param;

    const { errId, data } = await this.characteristicService.delete(requestData);

    return setResult({ chars: data }, errId);

  }

}

