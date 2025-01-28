import { ProductCreateDto } from '../dto';
import { createTranslation } from '@/common/utils';

export class ProductCreateEntity {
  constructor(private readonly data: ProductCreateDto) {}

  toPrisma() {
    return {
      name: this.data.name,
      price: this.data.price,
      available: this.data.available,
      instruction: createTranslation(this.data.instruction),
      ...(this.data.discount && { discount: this.data.discount }),
    };
  }
}
