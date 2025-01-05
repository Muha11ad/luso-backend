import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';

export class AddCategoryToProductDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  categoryIds: string[];
}
