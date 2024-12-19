import { Module } from '@nestjs/common';
import { CommonServiceModule } from '@/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [CommonServiceModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
