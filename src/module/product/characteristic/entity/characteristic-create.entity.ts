import { Prisma } from '@prisma/client';
import { CharacteristicCreateDto } from '../dto';
import { createTranslation } from '@/common/utils';

export class CharacteristicCreateEntity {
  constructor(private readonly data: CharacteristicCreateDto) {}

  toPrisma(): Prisma.CharacteristicUncheckedCreateInput {
    return {
      age: this.data.age,
      brand: this.data.brand,
      volume: this.data.volume,
      product_id: this.data.product_id,
      gender: createTranslation(this.data.gender),
      made_in: createTranslation(this.data.made_in),
      caution: createTranslation(this.data.caution),
      purpose: createTranslation(this.data.purpose),
      skin_type: createTranslation(this.data.skin_type),
      expiration_date: new Date(this.data.expiration_date),
      ingredients: createTranslation(this.data.ingredients),
      application_time: createTranslation(this.data.application_time),
    };
  }
}
