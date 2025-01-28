import { ConfigService } from '@nestjs/config';
import { ExceptionErrorTypes } from '@/types';
import { MailerService } from '@nestjs-modules/mailer';
import { BadGatewayException, Injectable } from '@nestjs/common';

@Injectable()
export class EmailProvider {
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendGmailToSuperAdmin(code: string): Promise<void> {
    const from = this.configService.get<string>('SENDER_EMAIL');
    const to = this.configService.get<string>('RECIEVER_EMAIL');
    const mailOptions = {
      from,
      to,
      subject: 'Super Admin Code',
      text: `Your code is: ${code}`,
      html: `<p>Your code is: <strong>${code}</strong></p>p`,
    };
    try {
      await this.mailService.sendMail(mailOptions);
    } catch (error) {
      throw new BadGatewayException(error.message + ExceptionErrorTypes.EMAIL_NOT_SENT);
    }
  }
}
