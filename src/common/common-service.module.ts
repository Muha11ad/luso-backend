import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { mailOptions, redisOptions } from './configs';
import { MailerModule } from '@nestjs-modules/mailer';
import { DatabaseService, EmailService, FilesService, RedisService } from './services';
@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync(mailOptions),
    CacheModule.registerAsync(redisOptions),
  ],
  providers: [EmailService, DatabaseService, FilesService, RedisService],
  exports: [EmailService, DatabaseService, FilesService, RedisService, CacheModule],
})
export class CommonServiceModule {}
