import { ProductExceptionErrorTypes } from '../../types';
import { CharacteristicExceptionErrorTypes } from '../types';
import { Characteristic, Prisma, Product } from '@prisma/client';
import { DatabaseService, RedisService } from '@/common/services';
import { CharacteristicCreateDto, CharacteristicUpdateDto } from '../dto';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CharacteristicCreateEntity, CharacteristicUpdateEntity } from '../entity';

@Injectable()
export class CharacteristicService {
  constructor(
    private readonly database: DatabaseService,
    private readonly redisService: RedisService,
  ) {}

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

  private async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
    errorType: string,
  ): Promise<T> {
    try {
      await this.redisService.delAll();
      return await operation();
    } catch (error) {
      throw new BadRequestException(`${errorType}: ${error.message}`);
    }
  }

  async create(data: CharacteristicCreateDto): Promise<Characteristic> {
    await this.checkProductExistsOrThrowException(data.product_id);
    const characteristicData = new CharacteristicCreateEntity(data);
    return this.handleDatabaseOperation(
      () => this.database.characteristic.create({ data: characteristicData.toPrisma() }),
      CharacteristicExceptionErrorTypes.ERROR_CREATING,
    );
  }

  async update(id: string, data: CharacteristicUpdateDto): Promise<Characteristic> {
    const characteristicExists = await this.checkCharacteristicExistsOrThrowException(id);
    if (data['product_id']) {
      await this.checkProductExistsOrThrowException(data.product_id);
    }
    const characteristicData = new CharacteristicUpdateEntity(characteristicExists, data);
    return this.handleDatabaseOperation(
      () =>
        this.database.characteristic.update({
          where: { id },
          data: characteristicData.toPrisma() as unknown as Prisma.CharacteristicUpdateInput,
        }),
      CharacteristicExceptionErrorTypes.ERROR_UPDATING,
    );
  }

  async delete(id: string): Promise<Characteristic> {
    await this.checkCharacteristicExistsOrThrowException(id);
    return this.handleDatabaseOperation(
      () => this.database.characteristic.delete({ where: { id } }),
      CharacteristicExceptionErrorTypes.ERROR_DELETING,
    );
  }
}
