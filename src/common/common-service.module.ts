import { pathToUpload } from './utils';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseService, EmailService, FilesService } from './services';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailerOptions } from './configs';

@Module({
  imports: [
    ConfigModule,
    ServeStaticModule.forRoot({ rootPath: pathToUpload, serveRoot: '/uploads' }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getMailerOptions(configService),
    }),
  ],
  providers: [EmailService, DatabaseService, FilesService],
  exports: [EmailService, DatabaseService, FilesService],
})
export class CommonServiceModule {}
