import { Characteristic } from '@prisma/client';
import { CharacteristicCreateDto, CharacteristicUpdateDto } from '../dto';

export interface ICharacteristicService {
  delete: (id: string) => Promise<Characteristic>;
  create: (data: CharacteristicCreateDto) => Promise<Characteristic>;
  update: (id: string, data: CharacteristicUpdateDto) => Promise<Characteristic>;
}
