import { PartialType } from '@nestjs/mapped-types';
import { CharacteristicCreateDto } from './create-characteristic.dto';

export class CharacteristicUpdateDto extends PartialType(CharacteristicCreateDto) {}
