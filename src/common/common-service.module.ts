import { pathToUpload } from './utils';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { getMailerOptions, redisOptions } from './configs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService, EmailService, FilesService, RedisService } from './services';

@Module({
  imports: [
    ConfigModule,
    ServeStaticModule.forRoot({ rootPath: pathToUpload, serveRoot: '/uploads' }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getMailerOptions(configService),
    }),
    CacheModule.registerAsync(redisOptions),
  ],
  providers: [EmailService, DatabaseService, FilesService, RedisService],
  exports: [EmailService, DatabaseService, FilesService, RedisService],
})
export class CommonServiceModule {}
