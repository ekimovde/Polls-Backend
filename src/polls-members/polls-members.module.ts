import { SequelizeModule } from '@nestjs/sequelize';
import { PollsMembers } from './polls-members.model';
import { Module } from '@nestjs/common';
import { PollsMembersService } from './polls-members.service';

@Module({
  imports: [SequelizeModule.forFeature([PollsMembers])],
  providers: [PollsMembersService],
  exports: [PollsMembersService],
})
export class PollsMembersModule {}
