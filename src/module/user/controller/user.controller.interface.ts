import { User } from '@prisma/client';
import { TelegramIdDto, UserCreateDto } from '../dto';

export interface IUserController {
  getAllUsers: () => Promise<User[]>;
  deleteUser: (param: TelegramIdDto) => Promise<User>;
  getUserById: (param: TelegramIdDto) => Promise<User>;
  getOrCreateUser: (data: UserCreateDto) => Promise<User>;
}
