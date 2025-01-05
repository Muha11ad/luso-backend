import { Type } from 'class-transformer';
import { TranslationsDto } from '@/common/dto';
import { IsDate, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CharacteristicCreateDto {
  @IsNotEmpty()
  @IsString()
  age: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsOptional()
  @IsObject()
  @Type(() => TranslationsDto)
  caution: TranslationsDto;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  expiration_date: Date;

  @IsNotEmpty()
  @IsString()
  volume: string;

  @IsNotEmpty()
  @IsObject()
  @Type(() => TranslationsDto)
  made_in: TranslationsDto;

  @IsNotEmpty()
  @IsObject()
  @Type(() => TranslationsDto)
  purpose: TranslationsDto;

  @IsNotEmpty()
  @IsObject()
  @Type(() => TranslationsDto)
  gender: TranslationsDto;

  @IsNotEmpty()
  @IsObject()
  @Type(() => TranslationsDto)
  skin_type: TranslationsDto;

  @IsNotEmpty()
  @IsObject()
  @Type(() => TranslationsDto)
  ingredients: TranslationsDto;

  @IsNotEmpty()
  @IsObject()
  @Type(() => TranslationsDto)
  application_time: TranslationsDto;

  @IsNotEmpty()
  @IsString()
  product_id: string;
}
