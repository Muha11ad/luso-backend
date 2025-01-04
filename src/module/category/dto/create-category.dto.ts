import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

class NameTranslations {
  @IsNotEmpty()
  @IsString()
  en: string;

  @IsNotEmpty()
  @IsString()
  ru: string;

  @IsNotEmpty()
  @IsString()
  uz: string;
}
class DescriptionTranslations {
  @IsNotEmpty()
  @IsString()
  en: string;

  @IsNotEmpty()
  @IsString()
  ru: string;

  @IsNotEmpty()
  @IsString()
  uz: string;
}

export class CategoryCreateDto {
  @IsNotEmpty()
  @IsObject()
  @Type(() => NameTranslations)
  name: NameTranslations;

  @IsNotEmpty()
  @IsObject()
  @Type(() => DescriptionTranslations)
  description: DescriptionTranslations;
}
