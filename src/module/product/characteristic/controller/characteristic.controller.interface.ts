import { IdDto } from '@/common/dto';
import { Characteristic } from '@prisma/client';
import { CharacteristicCreateDto, CharacteristicUpdateDto } from '../dto';

export class ICharacteristicController {
  deleteCharacteristic: (id: IdDto) => Promise<Characteristic>;
  createCharacteristic: (data: CharacteristicCreateDto) => Promise<Characteristic>;
  updateCharacteristic: (id: IdDto, data: CharacteristicUpdateDto) => Promise<Characteristic>;
}
