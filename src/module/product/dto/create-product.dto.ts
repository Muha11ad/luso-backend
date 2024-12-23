import { DtoErrorTypes } from '@/types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Translations {
  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  en: string;

  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  ru: string;

  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  uz: string;
}

export class ProductCreateDto {
  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsString()
  name: string;

  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  price: string;

  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsBoolean({ message: DtoErrorTypes.MUST_BE_BOOLEAN })
  available: boolean;

  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsObject({ message: 'Instruction must be an object' })
  @ValidateNested()
  @Type(() => Translations)
  instruction: Translations;

  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  category_id: string;

  @IsOptional()
  characteristic_id?: string;
}
