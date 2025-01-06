import { CharacteristicUpdateDto } from '../dto';
import { updateTranslation } from '@/common/utils';
import { Characteristic, Prisma } from '@prisma/client';

export class CharacteristicUpdateEntity {
  private updatingData: Partial<CharacteristicUpdateDto>;

  constructor(oldData: Characteristic, newData: CharacteristicUpdateDto) {
    this.updatingData = { ...newData };

    const fieldsToUpdate: (keyof CharacteristicUpdateDto)[] = [
      'caution',
      'made_in',
      'purpose',
      'gender',
      'skin_type',
      'ingredients',
      'application_time',
    ];

    fieldsToUpdate.forEach((field: string) => {
      if (newData[field]) {
        this.updatingData[field] = updateTranslation(oldData[field], newData[field]);
      }
    });
    if (newData['expiration_date']) {
      this.updatingData.expiration_date = new Date(newData.expiration_date);
    }
  }

  toPrisma() {
    return {
      ...this.updatingData,
    };
  }
}
