import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class ProductUpdateDto {
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  name?: string;

  @IsOptional()
  price?: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  imageUrl_1?: string;

  @IsOptional()
  imageUrl_2?: string;

  @IsOptional()
  imageUrl_3?: string;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  available?: boolean;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  category_id?: string;

  @IsOptional()
  characteristic_id?: string;
}
