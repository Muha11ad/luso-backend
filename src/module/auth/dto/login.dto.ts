import { DtoErrorTypes } from '@/types';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsEmail({}, { message: DtoErrorTypes.INVALID_EMAIL })
  email: string;

  @IsNotEmpty({ message: DtoErrorTypes.REQUIRED_INFO })
  @IsString({ message: DtoErrorTypes.MUST_BE_STRING })
  password: string;
}
