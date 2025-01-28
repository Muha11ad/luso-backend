import { IdDto } from '@/common/dto';
import { AuthGuard } from '@/module/auth';
import { CHARACTERISTIC_MESSAGE } from '../characteristic.const';
import { CharacteristicService } from '../service/characteristic.service';
import { CharacteristicCreateDto, CharacteristicUpdateDto } from '../dto';
import { ICharacteristicController } from './characteristic.controller.interface';
import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';

@Controller('characteristic')
export class CharacteristicController implements ICharacteristicController {
  constructor(private readonly characteristicService: CharacteristicService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCharacteristic(@Body() data: CharacteristicCreateDto): Promise<string> {
    await this.characteristicService.create(data);
    return CHARACTERISTIC_MESSAGE.success_create;
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateCharacteristic(
    @Param() param: IdDto,
    @Body() data: CharacteristicUpdateDto,
  ): Promise<string> {
    await this.characteristicService.update(param.id, data);
    return CHARACTERISTIC_MESSAGE.success_update;
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteCharacteristic(@Param() param: IdDto): Promise<string> {
    await this.characteristicService.delete(param.id);
    return CHARACTERISTIC_MESSAGE.success_delete;
  }
}
