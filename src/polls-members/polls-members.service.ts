import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PollsMembers } from './polls-members.model';

@Injectable()
export class PollsMembersService {
  constructor(
    @InjectModel(PollsMembers)
    private readonly pollsMembersRepository: typeof PollsMembers,
  ) {}

  async create(pollId: number, userId: number): Promise<void> {
    const candidate = await this.findByUserIdAndPollId(pollId, userId);

    if (candidate) {
      throw new HttpException(
        'Пользователь уже состоит в опросе!',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.pollsMembersRepository.create({ pollId, userId });
  }

  async findByUserIdAndPollId(
    pollId: number,
    userId: number,
  ): Promise<PollsMembers> {
    return await this.pollsMembersRepository.findOne({
      where: { pollId, userId },
    });
  }
}
