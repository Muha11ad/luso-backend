import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { AdminService } from './service/admin.service';
import { AdminController } from './controller/admin.controller';
import { CommonServiceModule } from '@/common/common-service.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from '@/common/configs';

@Module({
  imports: [CommonServiceModule, AuthModule, JwtModule.register(jwtOptions)],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
