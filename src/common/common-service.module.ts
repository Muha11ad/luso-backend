import { pathToUpload } from './utils';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { jwtOptions, mailOptions, redisOptions } from './configs';
import { DatabaseService, EmailService, FilesService, RedisService } from './services';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync(jwtOptions),
    MailerModule.forRootAsync(mailOptions),
    CacheModule.registerAsync(redisOptions),
    ServeStaticModule.forRoot({ rootPath: pathToUpload, serveRoot: '/uploads' }),
  ],
  providers: [EmailService, DatabaseService, FilesService, RedisService, JwtService],
  exports: [EmailService, DatabaseService, FilesService, RedisService, JwtService],
})
export class CommonServiceModule {}
