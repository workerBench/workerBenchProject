import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const nodeMailerOption = async (configService: ConfigService) => {
  return {
    transport: {
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: configService.get('GOOGLE_MAIL'),
        pass: configService.get('GOOGLE_PASSWORD'),
      },
    },
    defaults: {
      from: configService.get('GOOGLE_MAIL'),
    },
    template: {
      dir: __dirname + '/templates',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};
