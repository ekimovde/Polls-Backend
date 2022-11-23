import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PollsMembers } from './polls-members.model';

@Injectable()
export class PollsMembersService {
  constructor(
    @InjectModel(PollsMembers)
    private readonly pollsMembersRepository: typeof PollsMembers,
  ) {}

  async create(pollId: number, userId: number): Promise<void> {
    await this.pollsMembersRepository.create({ pollId, userId });
  }
}
