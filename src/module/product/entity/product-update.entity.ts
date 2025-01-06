import { TranslationType } from '@/types';
import { ProductUpdateDto } from '../dto';
import { Prisma, Product } from '@prisma/client';
import { updateTranslation } from '@/common/utils';

export class ProductUpdateEntity {
  private updatingData: Partial<Product> = {};

  constructor(oldData: Product, newData: ProductUpdateDto) {
    this.updatingData = { ...newData } as unknown as Partial<Product>;
    if (newData.instruction) {
      this.updatingData.instruction = updateTranslation(
        oldData.instruction as TranslationType,
        newData.instruction,
      );
    }
  }

  toPrisma(): Prisma.ProductUpdateInput {
    return {
      ...this.updatingData,
    };
  }
}
