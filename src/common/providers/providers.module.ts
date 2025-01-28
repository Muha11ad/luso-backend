import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailProvider } from './email.provider';
import { FilesProvider } from './files.provider';
import { RedisProvider } from './redis.provider';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailOptions, redisOptions } from '../configs';
import { DatabaseProvider } from './database.provider';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync(mailOptions),
    CacheModule.registerAsync(redisOptions),
  ],
  providers: [EmailProvider, DatabaseProvider, FilesProvider, RedisProvider],
  exports: [EmailProvider, DatabaseProvider, FilesProvider, RedisProvider, CacheModule],
})
export class ProvidersModule {}
