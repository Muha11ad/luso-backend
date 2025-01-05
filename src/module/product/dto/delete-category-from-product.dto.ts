import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCategoryFromProductDto {
  @IsString()
  @IsNotEmpty()
  categorytId: string;
}
