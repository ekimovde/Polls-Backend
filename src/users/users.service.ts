import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { ApiWrapper } from 'src/shared/constants';
import { getResponseForm } from 'src/shared/utils/get-response-form';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly fileService: FilesService,
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(updateUserDto, { where: { id } });
  }

  async getUsers(): Promise<ApiWrapper<User[]>> {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return getResponseForm<User[]>(users);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.destroy({ where: { id } });
  }
}
