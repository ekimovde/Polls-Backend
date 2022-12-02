import { PartialType } from '@nestjs/mapped-types';
import { CreateVoteDto } from 'src/polls-votes/dto/create-vote.dto';

export class SetVotePollDto extends PartialType(CreateVoteDto) {}
