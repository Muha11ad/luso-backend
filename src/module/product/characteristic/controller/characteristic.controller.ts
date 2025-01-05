import { IdDto } from '@/common/dto';
import { AuthGuard } from '@/module/auth';
import { Characteristic } from '@prisma/client';
import { CharacteristicService } from '../service/characteristic.service';
import { CharacteristicCreateDto, CharacteristicUpdateDto } from '../dto';
import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ICharacteristicController } from './characteristic.controller.interface';

@Controller('characteristic')
export class CharacteristicController implements ICharacteristicController {
  constructor(private readonly characteristicService: CharacteristicService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCharacteristic(@Body() data: CharacteristicCreateDto): Promise<Characteristic> {
    return await this.characteristicService.create(data);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateCharacteristic(
    @Param() param: IdDto,
    @Body() data: CharacteristicUpdateDto,
  ): Promise<Characteristic> {
    return await this.characteristicService.update(param.id, data);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteCharacteristic(@Param() param: IdDto): Promise<Characteristic> {
    return await this.characteristicService.delete(param.id);
  }
}
