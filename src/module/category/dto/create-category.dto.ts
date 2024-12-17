import { IsString, IsNotEmpty } from 'class-validator';

export class CategoryCreateNameDto {
  @IsNotEmpty({ message: 'Name is required and cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;
}
export type CategoryCreateType = {
  name: string;
  file: Express.Multer.File;
};
