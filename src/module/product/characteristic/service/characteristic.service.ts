import { CharacteristicCreateDto } from '../dto';
import { createTranslation } from '@/common/utils';
import { DatabaseService } from '@/common/services';
import { Characteristic, Prisma } from '@prisma/client';
import { ProductExceptionErrorTypes } from '../../types';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class CharacteristicService implements ICharacteristicService {
  constructor(private readonly database: DatabaseService) {}

  async create(product_id: string, data: CharacteristicCreateDto): Promise<Characteristic> {
    const productExists = await this.database.product.findUnique({
      where: { id: product_id },
    });
    if (productExists === null) {
      throw new NotFoundException(ProductExceptionErrorTypes.NOT_FOUND);
    }
    try {
      const characteristicData = {
        ...data,
        product_id: productExists.id,
        caution: createTranslation(data.caution),
        made_in: createTranslation(data.made_in),
        purpose: createTranslation(data.purpose),
        gender: createTranslation(data.gender),
        skin_type: createTranslation(data.skin_type),
        ingredients: createTranslation(data.ingredients),
        application_time: createTranslation(data.application_time),
      };
      return this.database.characteristic.create({
        data: characteristicData as Prisma.CharacteristicUncheckedCreateInput,
      });
    } catch (error) {
      throw new BadRequestException(`Error creating characteristic: ${error.message}`);
    }
  }
}
