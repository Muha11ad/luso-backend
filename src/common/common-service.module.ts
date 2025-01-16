import { pathToUpload } from './utils';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { mailOptions, redisOptions } from './configs';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseService, EmailService, FilesService, RedisService } from './services';
@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync(mailOptions),
    CacheModule.registerAsync(redisOptions),
    ServeStaticModule.forRoot({
      rootPath: pathToUpload,
      renderPath: '/uploads',
    }),
  ],
  providers: [EmailService, DatabaseService, FilesService, RedisService],
  exports: [EmailService, DatabaseService, FilesService, RedisService, CacheModule],
})
export class CommonServiceModule {}
