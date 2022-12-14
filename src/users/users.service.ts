import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import { FilesService } from 'src/files/files.service';
import { Poll } from 'src/polls/polls.model';
import { PollsService } from 'src/polls/polls.service';
import { UserProgressResponse } from 'src/shared/constants';
import { fakeUserProgressValue } from 'src/shared/fixtures/fake-user-progress';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordUserDto } from './dto/password-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly fileService: FilesService,
    private readonly pollsService: PollsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findByPk(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(updateUserDto, { where: { id } });
    return await this.userRepository.findByPk(id);
  }

  async setUserPassword(
    id: number,
    passwordUserDto: PasswordUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new HttpException(
        'Пользователь не найден!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { password, newPassword } = passwordUserDto;
    const passwordMatches = await argon2.verify(user.password, password);

    if (!passwordMatches) {
      throw new HttpException('Пароль не совпадает!', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await argon2.hash(newPassword);
    return await this.update(id, { password: hashedPassword });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.destroy({ where: { id } });
  }

  async getUserProgress(userId: number): Promise<UserProgressResponse> {
    const quantityOfCreatedPolls =
      await this.pollsService.getQuantityPollsByUserId(userId);
    const quantityOfConsistsPolls = await this.getQuantityOfConsistsPolls(
      userId,
    );
    const quantityOfParticipationPolls =
      await this.getQuantityOfParticipationPolls(userId);

    return {
      created: fakeUserProgressValue({ count: quantityOfCreatedPolls }),
      consists: fakeUserProgressValue({ count: quantityOfConsistsPolls }),
      participation: fakeUserProgressValue({
        count: quantityOfParticipationPolls,
      }),
    };
  }

  async getQuantityOfConsistsPolls(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      include: [
        {
          model: Poll,
          as: 'polls',
        },
      ],
    });

    return user.polls.length;
  }

  async getQuantityOfParticipationPolls(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      include: [
        {
          model: Poll,
          as: 'votes',
        },
      ],
    });

    return user.votes.length;
  }
}
