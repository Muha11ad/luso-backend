import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from '@/common/configs';
import { ProvidersModule } from '@/common/providers';
import { AdminService } from './service/admin.service';
import { AdminController } from './controller/admin.controller';

@Module({
  imports: [ProvidersModule, AuthModule, JwtModule.register(jwtOptions)],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
