import { IdDto } from '@/common/dto';
import { CharacteristicCreateDto, CharacteristicUpdateDto } from '../dto';

export class ICharacteristicController {
  deleteCharacteristic: (id: IdDto) => Promise<string>;
  createCharacteristic: (data: CharacteristicCreateDto) => Promise<string>;
  updateCharacteristic: (id: IdDto, data: CharacteristicUpdateDto) => Promise<string>;
}
