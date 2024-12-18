import { ConfigService } from '@nestjs/config';

export function getMailerOptions(configService: ConfigService) {
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
