import { User } from '@prisma/client';
import { UserCreateDto } from '../dto';

export interface IUserService {
  findAll: () => Promise<User[]>;
  create: (data: UserCreateDto) => Promise<User>;
  delete: (telegram_id: number) => Promise<User>;
  checkExistOrCreate: (data: UserCreateDto) => Promise<User>;
  findByTelegramId: (telegram_id: number) => Promise<User>;
}
