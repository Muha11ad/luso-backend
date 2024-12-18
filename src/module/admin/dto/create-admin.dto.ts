import { DtoErrorTypes } from '@/types';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AdminCreateDto {
  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsEmail({}, { message: DtoErrorTypes.INVALID_EMAIL })
  email: string;

  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  @Length(4, 20, { message: DtoErrorTypes.INVALID_PASSWORD })
  password: string;
}
