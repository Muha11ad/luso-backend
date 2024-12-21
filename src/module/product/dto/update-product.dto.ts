import { DtoErrorTypes } from '@/types';
import { Type } from 'class-transformer';
import { IsBoolean, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class Translations {
  @IsOptional()
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  en?: string;

  @IsOptional()
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  ru?: string;

  @IsOptional()
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  uz?: string;
}

export class ProductUpdateDto {
  @IsOptional()
  @IsObject({ message: 'Name must be an object' })
  @ValidateNested()
  @Type(() => Translations)
  name?: Translations;

  @IsOptional()
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  price?: string;

  @IsOptional()
  @IsBoolean({ message: DtoErrorTypes.MUST_BE_BOOLEAN })
  available?: boolean;

  @IsOptional()
  @IsObject({ message: 'Instruction must be an object' })
  @ValidateNested()
  @Type(() => Translations)
  instruction?: Translations;

  @IsOptional()
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  category_id?: string;

  @IsOptional()
  characteristic_id?: string;
}
