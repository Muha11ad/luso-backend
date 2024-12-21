import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';

class NameTranslations {
  @IsNotEmpty({ message: 'English name (en) is required' })
  @IsString({ message: 'English name (en) must be a string' })
  en: string;

  @IsNotEmpty({ message: 'Russian name (ru) is required' })
  @IsString({ message: 'Russian name (ru) must be a string' })
  ru: string;

  @IsNotEmpty({ message: 'Uzbek name (uz) is required' })
  @IsString({ message: 'Uzbek name (uz) must be a string' })
  uz: string;
}

export class CategoryCreateDto {
  @IsNotEmpty({ message: 'Name is required and cannot be empty' })
  @IsObject({ message: 'Name must be an object' })
  @ValidateNested()
  @Type(() => NameTranslations)
  name: NameTranslations;
}
