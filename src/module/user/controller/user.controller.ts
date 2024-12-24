import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IUserController } from './user.controller.interface';
import { UserService } from '../service/user.service';
import { AuthGuard } from '@/module/auth';
import { User } from '@prisma/client';
import { TelegramIdDto, UserCreateDto } from '../dto';

@Controller('user')
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(AuthGuard)
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }
  @Get('/:telegram_id')
  @UseGuards(AuthGuard)
  async getUserById(@Param() param: TelegramIdDto): Promise<User> {
    return await this.userService.findByTelegramId(Number(param.telegram_id));
  }
  @Post()
  async getOrCreateUser(@Body() data: UserCreateDto): Promise<User> {
    return await this.userService.checkExistOrCreate(data);
  }
  @Delete('/:telegram_id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param() param: TelegramIdDto): Promise<User> {
    return await this.userService.delete(Number(param.telegram_id));
  }
}
