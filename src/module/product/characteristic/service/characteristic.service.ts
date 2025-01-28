import { Characteristic, Prisma, Product } from '@prisma/client';
import { CHARACTERISTIC_MESSAGE } from '../characteristic.const';
import { DatabaseProvider, RedisProvider } from '@/common/providers';
import { CharacteristicCreateDto, CharacteristicUpdateDto } from '../dto';
import { CharacteristicCreateEntity, CharacteristicUpdateEntity } from '../entity';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class CharacteristicService {
  constructor(
    private readonly database: DatabaseProvider,
    private readonly redisProvider: RedisProvider,
  ) {}

  private async checkProductExistsOrThrowException(product_id: string): Promise<Product> {
    const productExists = await this.database.product.findUnique({
      where: { id: product_id },
    });
    if (!productExists) {
      throw new NotFoundException(CHARACTERISTIC_MESSAGE.error_product_not_found);
    }
    return productExists;
  }

  private async checkCharacteristicExistsOrThrowException(id: string): Promise<Characteristic> {
    const characteristicExists = await this.database.characteristic.findUnique({
      where: { id },
    });
    if (!characteristicExists) {
      throw new NotFoundException(CHARACTERISTIC_MESSAGE.error_not_found);
    }
    return characteristicExists;
  }

  private async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
    errorType: string,
  ): Promise<T> {
    try {
      await this.redisProvider.delAll();
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
      CHARACTERISTIC_MESSAGE.error_create,
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
      CHARACTERISTIC_MESSAGE.error_update,
    );
  }

  async delete(id: string): Promise<Characteristic> {
    await this.checkCharacteristicExistsOrThrowException(id);
    return this.handleDatabaseOperation(
      () => this.database.characteristic.delete({ where: { id } }),
      CHARACTERISTIC_MESSAGE.error_delete,
    );
  }
}
