import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { UsersModule } from './users/users.module';
import { PollsModule } from './polls/polls.module';
import { Poll } from './polls/polls.model';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import * as path from 'path';
import { NestjsFormDataModule, MemoryStoredFile } from 'nestjs-form-data';
import { MailModule } from './mail/mail.module';
import { PollsMembersModule } from './polls-members/polls-members.module';
import { PollsMembers } from './polls-members/polls-members.model';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PollsVotes } from './polls-votes/polls-votes.model';
import { PollsVotesModule } from './polls-votes/polls-votes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      models: [User, Poll, PollsMembers, PollsVotes],
      autoLoadModels: true,
    }),
    MailerModule.forRoot({
      // transport: {
      //   host: 'smtp.yandex.ru',
      //   auth: {
      //     user: 'ekimov@yandex.ru',
      //     pass: 'awenoxehbqrvqqqk',
      //   },
      // },
      transport: process.env.MAIL_TRANSPORT,
      defaults: {
        from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
      },
      template: {
        dir: join(__dirname, 'mails'),
        adapter: new HandlebarsAdapter(),
      },
    }),
    // MailerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: getMailConfig,
    // }),
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
    UsersModule,
    PollsModule,
    PollsMembersModule,
    PollsVotesModule,
    FilesModule,
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}
