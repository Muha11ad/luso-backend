import { IdDto } from '@/common/dto';
import { Characteristic } from '@prisma/client';
import { CharacteristicCreateDto, CharacteristicUpdateDto } from '../dto';

export class ICharacteristicController {
  deleteCharacteristic: (id: IdDto) => Promise<Characteristic>;
  updateCharacteristic: (id: IdDto, data: CharacteristicUpdateDto) => Promise<Characteristic>;
  createCharacteristic: (id: IdDto, data: CharacteristicCreateDto) => Promise<Characteristic>;
}
