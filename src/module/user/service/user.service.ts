import { User } from '@prisma/client';
import { UserCreateDto } from '../dto';
import { UserExceptionErrorTypes } from '../types';
import { DatabaseService } from '@/common/services';
import { IUserService } from './user.service.interface';
import { BadGatewayException, Injectable } from '@nestjs/common';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly database: DatabaseService) {}

  private async findById(telegram_id: number): Promise<User | null> {
    return this.database.user.findUnique({
      where: {
        telegram_id,
      },
      include: {
        orders: {
          include: {
            OrderDetails: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.database.user.findMany({
      include: {
        orders: {
          include: {
            OrderDetails: true,
          },
        },
      },
    });
  }

  async create(data: UserCreateDto) {
    try {
      return this.database.user.create({
        data,
      });
    } catch (error) {
      throw new BadGatewayException(UserExceptionErrorTypes.ERROR_CREATING_USER);
    }
  }

  async delete(telegram_id: number) {
    const existingUser = await this.findByTelegramId(telegram_id);
    if (!existingUser) {
      throw new BadGatewayException(UserExceptionErrorTypes.NOT_FOUND);
    }
    try {
      return this.database.user.delete({
        where: {
          telegram_id,
        },
      });
    } catch (error) {
      throw new BadGatewayException(UserExceptionErrorTypes.ERROR_DELETING_USER);
    }
  }

  async checkExistOrCreate(data: UserCreateDto) {
    const user = await this.findById(data.telegram_id);
    if (user) {
      return user;
    }
    return this.create(data);
  }

  async findByTelegramId(telegram_id: number): Promise<User> {
    const user = await this.findById(telegram_id);
    if (!user) {
      throw new BadGatewayException(UserExceptionErrorTypes.NOT_FOUND);
    }
    return user;
  }
}
