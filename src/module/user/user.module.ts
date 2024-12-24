import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { CommonServiceModule } from '@/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';

@Module({
  imports: [CommonServiceModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
