import { Module } from '@nestjs/common';
import { CommonServiceModule } from '@/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { jwtOptions } from '@/common/configs';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [CommonServiceModule, JwtModule.registerAsync(jwtOptions)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
