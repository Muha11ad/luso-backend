import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Name is required and cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  imageUrl: string;
}
