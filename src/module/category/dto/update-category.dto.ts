import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class NameTranslations {
  @IsOptional()
  @IsString({ message: 'English name (en) must be a string' })
  en?: string;

  @IsOptional()
  @IsString({ message: 'Russian name (ru) must be a string' })
  ru?: string;

  @IsOptional()
  @IsString({ message: 'Uzbek name (uz) must be a string' })
  uz?: string;
}

export class CategoryUpdateDto {
  @IsOptional()
  @IsObject({ message: 'Name must be an object' })
  @ValidateNested()
  @Type(() => NameTranslations)
  name?: NameTranslations;
}
