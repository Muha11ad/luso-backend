import { AdminModule } from './admin';
import { Module } from '@nestjs/common';
import { CategoryModule } from './category';
import { CommonServiceModule } from '@/common';
import { getMailerOptions } from '@/common/configs';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CategoryModule,
    CommonServiceModule,
    ConfigModule.forRoot(),
    AdminModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getMailerOptions(configService),
    }),
  ],
})
export class AppModule {}
