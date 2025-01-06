import { TranslationType } from '@/types';
import { ProductUpdateDto } from '../dto';
import { Prisma, Product } from '@prisma/client';
import { updateTranslation } from '@/common/utils';

export class ProductUpdateEntity {
  private name: string | null;
  private price: number | null;
  private available: boolean | null;
  private instruction: TranslationType | null;

  constructor(oldData: Product, newData: ProductUpdateDto) {
    this.name = newData.name ?? null;
    this.price = newData.price ?? null;
    this.available = newData.available ?? null;
    this.instruction = newData.instruction
      ? updateTranslation(oldData.instruction as TranslationType, newData.instruction)
      : null;
  }

  toPrisma(): Prisma.ProductUpdateInput {
    const { name, price, available, instruction } = this;
    return {
      ...(name && { name }),
      ...(price && { price }),
      ...(available && { available }),
      ...(instruction && { instruction }),
    };
  }
}
