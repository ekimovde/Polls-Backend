import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { CreateVoteDto } from './dto/create-vote.dto';
import { PollsVotes } from './polls-votes.model';

@Injectable()
export class PollsVotesService {
  constructor(
    @InjectModel(PollsVotes)
    private readonly pollsVotesRepository: typeof PollsVotes,
  ) {}

  async create(createVoteDto: CreateVoteDto): Promise<void> {
    const { userId, pollId } = createVoteDto;
    const candidate = await this.findByUserIdAndPollId(userId, pollId);

    if (candidate) {
      throw new HttpException(
        'Пользователь уже сделал голос!',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.pollsVotesRepository.create(createVoteDto);
  }

  async findByUserIdAndPollId(
    userId: number,
    pollId: number,
  ): Promise<PollsVotes> {
    return await this.pollsVotesRepository.findOne({
      where: { pollId, userId },
    });
  }

  async findAllByPollId(pollId: number): Promise<PollsVotes[]> {
    return await this.pollsVotesRepository.findAll({
      where: { pollId },
      attributes: ['userId', 'timestamp'],
    });
  }

  async findAllVoteUsersByPollId(pollId: number): Promise<User[]> {
    const pollsVotes = await this.pollsVotesRepository.findAll({
      where: { pollId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'avatar'],
        },
      ],
    });

    return pollsVotes.map((item) => item.author);
  }

  async getQuantityOfVotesByPollId(pollId: number): Promise<number> {
    return await this.pollsVotesRepository.count({ where: { pollId } });
  }
}
