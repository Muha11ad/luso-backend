import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { ProvidersModule } from '@/common/providers';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';

@Module({
  imports: [ProvidersModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
