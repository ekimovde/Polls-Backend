import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { FilesModule } from 'src/files/files.module';
import { PollsMembersModule } from 'src/polls-members/polls-members.module';
import { Poll } from 'src/polls/polls.model';
import { PollsModule } from 'src/polls/polls.module';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Poll]),
    FilesModule,
    PollsModule,
    PollsMembersModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
