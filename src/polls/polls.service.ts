import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/users.model';
import { CreatePollDto } from './dto/create-poll.dto';
import { SendInvitePollDto } from './dto/send-invite-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll } from './polls.model';

@Injectable()
export class PollsService {
  constructor(
    @InjectModel(Poll) private readonly pollRepository: typeof Poll,
    private readonly mailService: MailService,
  ) {}

  async create(createPollDto: CreatePollDto): Promise<Poll> {
    return await this.pollRepository.create(createPollDto);
  }

  async findAll(): Promise<Poll[]> {
    return await this.pollRepository.findAll();
  }

  async findAllMy(userId: number): Promise<Poll[]> {
    return await this.pollRepository.findAll({
      include: [
        {
          model: User,
          as: 'author',
          where: { id: userId },
        },
      ],
    });
  }

  async findById(id: number): Promise<Poll> {
    return await this.pollRepository.findByPk(id);
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

  async isMyPoll(userId: number, pollId: number): Promise<void> {
    const poll = await this.findById(pollId);

    if (poll.userId === userId) {
      return;
    }

    throw new HttpException('Нет прав для удаления!', HttpStatus.BAD_REQUEST);
  }
}
