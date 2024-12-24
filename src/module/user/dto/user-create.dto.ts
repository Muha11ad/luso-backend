import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserCreateDto {
  @IsNumber()
  @IsNotEmpty()
  telegram_id: number;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  username: string;
}
