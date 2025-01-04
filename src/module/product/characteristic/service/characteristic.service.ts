import { TranslationType } from '@/types';
import { DatabaseService } from '@/common/services';
import { ProductExceptionErrorTypes } from '../../types';
import { CharacteristicExceptionErrorTypes } from '../types';
import { Characteristic, Prisma, Product } from '@prisma/client';
import { createTranslation, updateTranslation } from '@/common/utils';
import { CharacteristicCreateDto, CharacteristicUpdateDto } from '../dto';
import { ICharacteristicService } from './characteristic.service.interface';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class CharacteristicService implements ICharacteristicService {
  constructor(private readonly database: DatabaseService) {}

  private async checkProductExistsOrThrowException(product_id: string): Promise<Product> {
    const productExists = await this.database.product.findUnique({
      where: { id: product_id },
    });
    if (!productExists) {
      throw new NotFoundException(ProductExceptionErrorTypes.NOT_FOUND);
    }
    return productExists;
  }

  private async checkCharacteristicExistsOrThrowException(id: string): Promise<Characteristic> {
    const characteristicExists = await this.database.characteristic.findUnique({
      where: { id },
    });
    if (!characteristicExists) {
      throw new NotFoundException(CharacteristicExceptionErrorTypes.NOT_FOUND);
    }
    return characteristicExists;
  }

  private createCharacteristicData(data: CharacteristicCreateDto, productId: string) {
    return {
      ...data,
      product_id: productId,
      caution: createTranslation(data.caution),
      made_in: createTranslation(data.made_in),
      purpose: createTranslation(data.purpose),
      gender: createTranslation(data.gender),
      skin_type: createTranslation(data.skin_type),
      ingredients: createTranslation(data.ingredients),
      application_time: createTranslation(data.application_time),
    };
  }

  private updateCharacteristicData(
    existing: Characteristic,
    data: CharacteristicUpdateDto,
  ): Partial<Characteristic> {
    return {
      ...data,
      ...(data['caution'] && {
        caution: updateTranslation(existing.caution as TranslationType, data.caution),
      }),
      ...(data['made_in'] && {
        made_in: updateTranslation(existing.made_in as TranslationType, data.made_in),
      }),
      ...(data['purpose'] && {
        purpose: updateTranslation(existing.purpose as TranslationType, data.purpose),
      }),
      ...(data['gender'] && {
        gender: updateTranslation(existing.gender as TranslationType, data.gender),
      }),
      ...(data['skin_type'] && {
        skin_type: updateTranslation(existing.skin_type as TranslationType, data.skin_type),
      }),
      ...(data['ingredients'] && {
        ingredients: updateTranslation(existing.ingredients as TranslationType, data.ingredients),
      }),
      ...(data['application_time'] && {
        application_time: updateTranslation(
          existing.application_time as TranslationType,
          data.application_time,
        ),
      }),
    };
  }

  async create(product_id: string, data: CharacteristicCreateDto): Promise<Characteristic> {
    await this.checkProductExistsOrThrowException(product_id);
    try {
      const characteristicData = this.createCharacteristicData(data, product_id);
      return this.database.characteristic.create({
        data: characteristicData as Prisma.CharacteristicUncheckedCreateInput,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `${CharacteristicExceptionErrorTypes.ERROR_CREATING}: ${error.message}`,
      );
    }
  }

  async update(id: string, data: CharacteristicUpdateDto): Promise<Characteristic> {
    const characteristicExists = await this.checkCharacteristicExistsOrThrowException(id);
    if (data.product_id) {
      await this.checkProductExistsOrThrowException(data.product_id);
    }
    try {
      const characteristicData = this.updateCharacteristicData(characteristicExists, data);
      return this.database.characteristic.update({
        where: { id },
        data: characteristicData as Prisma.CharacteristicUncheckedUpdateInput,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `${CharacteristicExceptionErrorTypes.ERROR_UPDATING}: ${error.message}`,
      );
    }
  }

  async delete(id: string): Promise<Characteristic> {
    await this.checkCharacteristicExistsOrThrowException(id);
    try {
      return this.database.characteristic.delete({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `${CharacteristicExceptionErrorTypes.ERROR_DELETING}: ${error.message}`,
      );
    }
  }
}
