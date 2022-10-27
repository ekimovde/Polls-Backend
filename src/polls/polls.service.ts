import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiWrapper } from 'src/shared/constants';
import { getResponseForm } from 'src/shared/utils/get-response-form';
import { CreatePollDto } from './dto/create-poll-dto';
import { Poll } from './polls.model';

@Injectable()
export class PollsService {
  constructor(
    @InjectModel(Poll) private readonly pollRepository: typeof Poll,
  ) {}

  async getPolls(): Promise<ApiWrapper<Poll[]>> {
    const polls = await this.pollRepository.findAll();

    return getResponseForm<Poll[]>(polls);
  }

  async create(dto: CreatePollDto): Promise<ApiWrapper<Poll>> {
    const poll = await this.pollRepository.create(dto);

    return getResponseForm<Poll>(poll);
  }
}
