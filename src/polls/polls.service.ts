import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MailService } from 'src/mail/mail.service';
import { PollsMembersService } from 'src/polls-members/polls-members.service';
import { DEFAULT_LIMIT_OF_POPULAR_POLLS } from 'src/shared/constants';
import { User } from 'src/users/users.model';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollDto } from './dto/join-poll.dtdo';
import { SendInvitePollDto } from './dto/send-invite-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll } from './polls.model';

@Injectable()
export class PollsService {
  constructor(
    @InjectModel(Poll) private readonly pollRepository: typeof Poll,
    private readonly pollsMembersService: PollsMembersService,
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

  async getPopularPolls(userId: number): Promise<Poll[]> {
    return await this.pollRepository.findAll({
      where: { userId },
      limit: DEFAULT_LIMIT_OF_POPULAR_POLLS,
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'fullName', 'avatar'],
        },
      ],
    });
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

  getAttributesByScope(scope: string): string[] {
    return scope ? scope.split(',') : [];
  }
}
