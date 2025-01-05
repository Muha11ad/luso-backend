import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteProductFromCategoryDto {
  @IsNotEmpty()
  @IsString()
  productId: string;
}
