import { AuthModule } from '../auth';
import { Module } from '@nestjs/common';
import { AdminService } from './service/admin.service';
import { AdminController } from './controller/admin.controller';
import { CommonServiceModule } from '@/common/common-service.module';

@Module({
  imports: [CommonServiceModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
