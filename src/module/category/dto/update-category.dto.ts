import { IsString, IsOptional } from 'class-validator';

export class CategoryUpdateNameDto {
  @IsOptional()
  @IsString()
  name: string;
}
export type CategoryUpdateType = {
  name?: string;
  file?: Express.Multer.File;
};
