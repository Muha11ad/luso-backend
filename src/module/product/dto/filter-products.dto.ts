import { IsNotEmpty, IsString } from 'class-validator';

export class FilterProductsDto {
  @IsString()
  age: string;

  @IsString()
  skin_type: string;
}
