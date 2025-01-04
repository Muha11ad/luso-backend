import { PartialType } from '@nestjs/mapped-types';
import { ProductCreateDto } from './create-product.dto';

export class ProductUpdateDto extends PartialType(ProductCreateDto) {}
