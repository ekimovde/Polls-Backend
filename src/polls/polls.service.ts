import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MailService } from 'src/mail/mail.service';
import { PollsMembersService } from 'src/polls-members/polls-members.service';
import { CreateVoteDto } from 'src/polls-votes/dto/create-vote.dto';
import { PollsVotesService } from 'src/polls-votes/polls-votes.service';
import {
  DEFAULT_LIMIT_OF_POPULAR_POLLS,
  SORT_ATTR_FOR_POLLS,
  SORT_TYPE_FOR_POLLS,
} from 'src/shared/constants';
import { setVotesByTimestamp } from 'src/shared/utils/set-votes-by-timestamp';
import { timestampIdsAndQuantitiesInPoll } from 'src/shared/utils/timestamp-ids-and-quantities-in-poll';
import { User } from 'src/users/users.model';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollDto } from './dto/join-poll.dtdo';
import { SendInvitePollDto } from './dto/send-invite-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollQuestionAnswer, PollVoteResults } from './model';
import { Poll } from './polls.model';

@Injectable()
export class PollsService {
  constructor(
    @InjectModel(Poll) private readonly pollRepository: typeof Poll,
    private readonly pollsMembersService: PollsMembersService,
    private readonly pollsVotesService: PollsVotesService,
    private readonly mailService: MailService,
  ) {}

  async create(createPollDto: CreatePollDto): Promise<Poll> {
    const poll = await this.pollRepository.create(createPollDto);

    await this.pollsMembersService.create(poll.id, createPollDto.userId);

    return poll;
  }

  async findAll(scope: string): Promise<Poll[]> {
    return await this.pollRepository.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'avatar'],
        },
        {
          model: User,
          as: 'members',
          attributes: ['id'],
        },
      ],
      order: [[SORT_ATTR_FOR_POLLS, SORT_TYPE_FOR_POLLS]],
      attributes: [
        'id',
        'name',
        'color',
        'category',
        'isPublic',
        'created',
        ...this.getAttributesByScope(scope),
      ],
    });
  }

  async findAllMy(userId: number, scope: string): Promise<Poll[]> {
    return await this.pollRepository.findAll({
      include: [
        {
          model: User,
          as: 'author',
          where: { id: userId },
        },
        {
          model: User,
          as: 'members',
          attributes: ['id', 'fullName', 'avatar'],
        },
      ],
      order: [[SORT_ATTR_FOR_POLLS, SORT_TYPE_FOR_POLLS]],
      attributes: [
        'id',
        'name',
        'color',
        'category',
        'isPublic',
        'created',
        ...this.getAttributesByScope(scope),
      ],
    });
  }

  async findById(id: number): Promise<Poll> {
    return await this.pollRepository.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'avatar'],
        },
        {
          model: User,
          as: 'members',
          attributes: ['id', 'fullName', 'avatar'],
        },
      ],
    });
  }

  async findAllMembers(id: number): Promise<User[]> {
    const poll = await this.pollRepository.findByPk(id, {
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'fullName', 'avatar'],
        },
      ],
    });

    return poll.members;
  }

  async update(
    userId: number,
    pollId: number,
    updatePollDto: UpdatePollDto,
  ): Promise<void> {
    await this.isMyPoll(userId, pollId);
    await this.pollRepository.update(updatePollDto, { where: { id: pollId } });
  }

  async remove(userId: number, pollId: number): Promise<void> {
    await this.isMyPoll(userId, pollId);
    await this.pollRepository.destroy({ where: { id: pollId } });
  }

  async sendInvite(sendInvitePollDto: SendInvitePollDto): Promise<void> {
    const { emailTo, description } = sendInvitePollDto;
    await this.mailService.sendMail(emailTo, description);
  }

  async join(joinPollDto: JoinPollDto): Promise<void> {
    const { pollId, userId } = joinPollDto;
    await this.pollsMembersService.create(pollId, userId);
  }

  async setVote(createVoteDto: CreateVoteDto): Promise<void> {
    await this.pollsVotesService.create(createVoteDto);
  }

  async getPollVoteResults(
    userId: number,
    pollId: number,
  ): Promise<PollVoteResults> {
    const pollQuestionAnswers = await this.getQuestionAnswersById(pollId);
    const pollVoteUsers = await this.pollsVotesService.findAllVoteUsersByPollId(
      pollId,
    );
    const quantityOfVotes =
      await this.pollsVotesService.getQuantityOfVotesByPollId(pollId);
    const selectedAnswers = await this.pollsVotesService.findAllByPollId(
      pollId,
    );
    const selectedAnswer = selectedAnswers.find(
      (item) => item.userId === userId,
    );

    const timestampIdsAndQuantities =
      timestampIdsAndQuantitiesInPoll(pollQuestionAnswers);

    const hasSelectedAnswer = Boolean(selectedAnswer);

    return {
      total: quantityOfVotes,
      progress: setVotesByTimestamp(timestampIdsAndQuantities, selectedAnswers),
      answers: pollQuestionAnswers,
      users: pollVoteUsers,
      selectedAnswer: hasSelectedAnswer
        ? Number(selectedAnswer.timestamp)
        : null,
    };
  }

  async getPopularPolls(userId: number): Promise<Poll[]> {
    return await this.pollRepository.findAll({
      where: { userId },
      limit: DEFAULT_LIMIT_OF_POPULAR_POLLS,
      order: [[SORT_ATTR_FOR_POLLS, SORT_TYPE_FOR_POLLS]],
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'fullName', 'avatar'],
        },
      ],
    });
  }

  async endPoll(userId: number, pollId: number): Promise<void> {
    const candidate = await this.pollRepository.findOne({
      where: { userId, id: pollId },
    });

    if (!candidate) {
      throw new HttpException(
        'Вы не являетесь автором опроса!',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.pollRepository.update(
      { isPollEnded: true },
      { where: { id: pollId } },
    );
  }

  async isMyPoll(userId: number, pollId: number): Promise<void> {
    const poll = await this.findById(pollId);

    if (poll.userId === userId) {
      return;
    }

    throw new HttpException('Нет прав для удаления!', HttpStatus.BAD_REQUEST);
  }

  async getQuantityPollsByUserId(userId: number): Promise<number> {
    return await this.pollRepository.count({ where: { userId } });
  }

  async getQuestionAnswersById(id: number): Promise<PollQuestionAnswer[]> {
    const poll = await this.pollRepository.findByPk(id, {
      attributes: ['question'],
    });

    return poll.question.answers;
  }

  getAttributesByScope(scope: string): string[] {
    return scope ? scope.split(',') : [];
  }
}
