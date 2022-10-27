import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { ApiWrapper } from 'src/shared/constants';
import { getResponseForm } from 'src/shared/utils/get-response-form';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly fileService: FilesService,
  ) {}

  async getUsers(): Promise<ApiWrapper<User[]>> {
    const users = await this.userRepository.findAll({ include: { all: true } });

    return getResponseForm<User[]>(users);
  }

  async create(dto: CreateUserDto): Promise<ApiWrapper<User>> {
    const user = await this.userRepository.create(dto);

    return getResponseForm<User>(user);
  }

  async getUserByEmail(email: string): Promise<ApiWrapper<User>> {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });

    return getResponseForm<User>(user);
  }

  async uploadAvatar(): Promise<void> {
    //
  }
}
