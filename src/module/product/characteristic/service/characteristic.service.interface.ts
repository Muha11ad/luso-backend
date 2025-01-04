import { Characteristic } from '@prisma/client';
import { CharacteristicCreateDto, CharacteristicUpdateDto } from '../dto';

export interface ICharacteristicService {
  delete: (id: string) => Promise<Characteristic>;
  update: (id: string, data: CharacteristicUpdateDto) => Promise<Characteristic>;
  create: (product_id: string, data: CharacteristicCreateDto) => Promise<Characteristic>;
}
