import { DtoErrorTypes } from '@/types';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProductCreateDto {
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  name: string;
  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  price: string;
  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsBoolean({ message: DtoErrorTypes.MUST_BE_BOOLEAN })
  available: boolean;
  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  description: string;
  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  category_id: string;
  @IsOptional()
  characteristic_id?: string;
}
