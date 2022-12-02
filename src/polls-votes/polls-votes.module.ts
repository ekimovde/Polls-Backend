import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PollsVotes } from './polls-votes.model';
import { PollsVotesService } from './polls-votes.service';

@Module({
  imports: [SequelizeModule.forFeature([PollsVotes])],
  providers: [PollsVotesService],
  exports: [PollsVotesService],
})
export class PollsVotesModule {}
