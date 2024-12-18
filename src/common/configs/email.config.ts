import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';

export const mailOptions: MailerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => getMailerConfigs(configService),
};

export function getMailerConfigs(configService: ConfigService) {
  return {
    transport: {
      service: 'gmail',
      auth: {
        user: configService.get<string>('SENDER_EMAIL'),
        pass: configService.get<string>('SENDER_PASS'),
      },
    },
    defaults: {
      from: `"No Reply" <${configService.get<string>('SENDER_EMAIL')}>`,
    },
  };
}
