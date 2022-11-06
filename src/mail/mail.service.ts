import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, description: string) {
    return await this.mailerService
      .sendMail({
        to,
        subject: 'Подтверждение регистрации',
        template: `<p>${description}</p>`,
        context: {
          username: 'Служба безопасности Polls',
        },
      })
      .catch((e) => {
        throw new HttpException(
          `Ошибка работы почты: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
}
