import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import { FilesService } from 'src/files/files.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordUserDto } from './dto/password-user.dto';
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
}
