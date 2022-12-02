import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Poll } from './polls.model';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { PollsMembersModule } from 'src/polls-members/polls-members.module';
import { PollsVotesModule } from 'src/polls-votes/polls-votes.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Poll]),
    AuthModule,
    MailModule,
    PollsMembersModule,
    PollsVotesModule,
  ],
  exports: [PollsService],
  providers: [PollsService],
  controllers: [PollsController],
})
export class PollsModule {}
