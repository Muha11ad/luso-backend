import { IsNotEmpty, IsString } from 'class-validator';

export class TranslationsDto {
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
