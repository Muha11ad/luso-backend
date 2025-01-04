import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DtoErrorTypes } from '@/types';
import { Type } from 'class-transformer';
import { TranslationsDto } from '@/common/dto';

export class ProductCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  available: boolean;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslationsDto)
  instruction: TranslationsDto;

  @IsNotEmpty()
  @IsString()
  category_id: string;
}
