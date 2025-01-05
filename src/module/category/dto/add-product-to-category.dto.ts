import { IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddProductToCategoryDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  productIds: string[];
}
